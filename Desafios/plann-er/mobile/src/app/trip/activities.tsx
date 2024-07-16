import { Activity, ActivityProps } from "@/components/activity";
import { Button } from "@/components/button";
import { Calendar } from "@/components/calendar";
import { Input } from "@/components/input";
import { Modal } from "@/components/modal";
import { activitiesServer } from "@/server/activities-server";
import { colors } from "@/styles/colors";
import dayjs from "dayjs";
import {
  Clock,
  Calendar as IconCalendar,
  PlusIcon,
  Tag,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import { Alert, Keyboard, SectionList, Text, View } from "react-native";
import { TripDataProps } from "./[id]";
import { Loading } from "@/components/loading";

interface Activities {
  tripDetails: TripDataProps;
}

interface TripActivitiesProps {
  title: {
    dayNumber: number;
    dayName: string;
  };
  data: ActivityProps[];
}

enum ModalEnum {
  NONE = 0,
  NEW_ACTIVITY = 1,
  CALENDAR = 2,
}

export function Activities({ tripDetails }: Activities) {
  const [isCreatingActivity, setIsCreatingActivity] = useState(false);
  const [isLoadingActivities, setIsLoadingActivities] = useState(true);

  const [showModal, setShowModal] = useState(ModalEnum.NONE);

  const [activityTitle, setActivityTitle] = useState("");
  const [activityDate, setActivityDate] = useState("");
  const [activityHour, setActivityHour] = useState("");

  const [tripActivities, setTripsActivities] = useState<TripActivitiesProps[]>(
    []
  );

  function filterNumericKeys(text: string) {
    return text
      .replace(",", "")
      .replace(".", "")
      .replace("*", "")
      .replace("(", "")
      .replace(")", "")
      .replace("#", "")
      .replace("+", "")
      .replace(";", "")
      .replace("-", "")
      .replace("/", "")
      .replace("N", "")
      .replace(" ", "");
  }

  function resetNewActivitiesField() {
    setActivityDate("");
    setActivityHour("");
    setActivityTitle("");
    setShowModal(ModalEnum.NONE);
  }

  async function handleCreateTripActivity() {
    try {
      if (!activityTitle || !activityDate || !activityHour)
        return Alert.alert("Cadastrar atividade", "Preencha todos os campos!");

      setIsCreatingActivity(true);

      await activitiesServer.createActivity({
        tripId: tripDetails.id,
        title: activityTitle,
        occurs_at: dayjs(activityDate)
          .add(Number(activityHour), "h")
          .toString(),
      });

      Alert.alert("Nova atividade", "Nova atividade cadastrada com sucesso!");

      await getTripActivities();
      resetNewActivitiesField();
    } catch (error) {
      console.log(error);
    } finally {
      setIsCreatingActivity(false);
    }
  }

  async function getTripActivities() {
    try {
      const activities = await activitiesServer.getActivitiesByTripId(
        tripDetails.id
      );

      const activitiesToSectionList = activities.map((dayActivities) => ({
        title: {
          dayNumber: dayjs(dayActivities.date).date(),
          dayName: dayjs(dayActivities.date)
            .format("dddd")
            .replace("-feira", ""),
        },
        data: dayActivities.activities.map((activity) => ({
          id: activity.id,
          title: activity.title,
          hour: dayjs(activity.occurs_at).format("hh[:]mm[h]"),
          isBefore: dayjs(activity.occurs_at).isBefore(dayjs()),
        })),
      }));

      setTripsActivities(activitiesToSectionList);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingActivities(false);
    }
  }

  useEffect(() => {
    getTripActivities();
  }, []);

  return (
    <View className="flex-1">
      <View className="w-full flex-row mt-5 mb-6 items-center">
        <Text className="text-zinc-50 text-2xl font-semibold flex-1">
          Atividades
        </Text>

        <Button onPress={() => setShowModal(ModalEnum.NEW_ACTIVITY)}>
          <PlusIcon size={20} color={colors.lime[950]} />
          <Button.Title>Nova atividade</Button.Title>
        </Button>
      </View>

      {isLoadingActivities ? (
        <Loading />
      ) : (
        <SectionList
          sections={tripActivities}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <Activity data={item} />}
          renderSectionHeader={({ section }) => (
            <View className="w-full">
              <Text className="text-zinc-50 text-2xl font-semibold py-2">
                Dia {section.title.dayNumber + " "}
                <Text className="text-zinc-500 text-base font-regular capitalize">
                  {section.title.dayName}
                </Text>
              </Text>
              {section.data.length === 0 && (
                <Text className="text-sm text-zinc-500 font-regular mb-8">
                  Nenhuma atividade cadastrada nessa data
                </Text>
              )}
            </View>
          )}
          contentContainerClassName="gap-3 pb-48"
          showsVerticalScrollIndicator={false}
        />
      )}

      <Modal
        title="Cadastrar atividade"
        subtitle="Todos os convidados podem visualizar as atividades."
        visible={showModal === ModalEnum.NEW_ACTIVITY}
        onClose={() => setShowModal(ModalEnum.NONE)}
      >
        <View className="mt=4 mb-3">
          <Input variant="secondary">
            <Tag color={colors.zinc[400]} size={20} />
            <Input.Field
              placeholder="Qual atividade?"
              onChangeText={setActivityTitle}
              value={activityTitle}
            />
          </Input>

          <View className="w-full mt-2 flex-row gap-2">
            <Input variant="secondary" className="flex-1">
              <IconCalendar color={colors.zinc[400]} size={20} />
              <Input.Field
                placeholder="Data"
                value={
                  activityDate ? dayjs(activityDate).format("DD [de] MMMM") : ""
                }
                onFocus={() => Keyboard.dismiss()}
                onPressIn={() => setShowModal(ModalEnum.CALENDAR)}
              />
            </Input>

            <Input variant="secondary" className="flex-1">
              <Clock color={colors.zinc[400]} size={20} />
              <Input.Field
                placeholder="Horário"
                onChangeText={(text) =>
                  setActivityHour(filterNumericKeys(text))
                }
                value={activityHour}
                keyboardType="numeric"
                maxLength={2}
              />
            </Input>
          </View>
        </View>

        <Button
          onPress={handleCreateTripActivity}
          isLoading={isCreatingActivity}
        >
          <Button.Title>Salvar atividade</Button.Title>
        </Button>
      </Modal>

      <Modal
        title="Selecionar datas"
        subtitle="Selecione a data da atividade"
        visible={showModal === ModalEnum.CALENDAR}
        onClose={() => setShowModal(ModalEnum.NONE)}
      >
        <View className="gap-4 mt-4">
          <Calendar
            onDayPress={(day) => setActivityDate(day.dateString)}
            markedDates={{ [activityDate]: { selected: true } }}
            initialDate={tripDetails.starts_at.toString()}
            minDate={tripDetails.starts_at.toString()}
            maxDate={tripDetails.ends_at.toString()}
          />
          <Button
            onPress={() => setShowModal(ModalEnum.NEW_ACTIVITY)}
            className="w-full"
          >
            <Button.Title>Confirmar</Button.Title>
          </Button>
        </View>
      </Modal>
    </View>
  );
}
