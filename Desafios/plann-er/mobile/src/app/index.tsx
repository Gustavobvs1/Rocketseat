import { Button } from "@/components/button";
import { Calendar } from "@/components/calendar";
import { GuestEmail } from "@/components/email";
import { Input } from "@/components/input";
import { Loading } from "@/components/loading";
import { Modal } from "@/components/modal";
import { tripServer } from "@/server/trip-server";
import { tripStorage } from "@/storage/trip";
import { colors } from "@/styles/colors";
import { calendarUtils, DatesSelected } from "@/utils/calendar-utils";
import dayjs from "dayjs";
import { router } from "expo-router";
import {
  ArrowRight,
  AtSign,
  Calendar as IconCalendar,
  MapPin,
  Settings2,
  UserRoundPlus,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import { Alert, Image, Keyboard, Text, View } from "react-native";
import { DateData } from "react-native-calendars";
import { validateInput } from "./../utils/validate-input";

enum StepForm {
  TRIP_DETAILS = 1,
  ADD_EMAILS = 2,
}

enum ModalEnum {
  NONE = 0,
  CALENDAR = 1,
  GUESTS = 2,
}

export default function Index() {
  const [stepForm, setStepForm] = useState(StepForm.TRIP_DETAILS);

  const [isCreatingTrip, setIsCreatingTrip] = useState(false);

  const [showModal, setShowModal] = useState(ModalEnum.NONE);

  const [isGettingTrip, setIsGettingTrip] = useState(true);

  const [selectedDates, setSelectedDates] = useState({} as DatesSelected);
  const [destination, setDestination] = useState("");
  const [emailToInvite, setEmailToInvite] = useState("");
  const [emailsToInvite, setEmailsToInvite] = useState<string[]>([]);

  function handleNextStepForm() {
    if (
      destination.trim().length === 0 ||
      !selectedDates.startsAt ||
      !selectedDates.endsAt
    )
      return Alert.alert(
        "Detalhes da viagem",
        "Preencha todas as informações da viagem para seguir "
      );
    if (destination.length < 4)
      return Alert.alert(
        "Detalhes da viagem",
        "O nome do destino deve conter pelo menos 4 caracteres"
      );
    if (stepForm === StepForm.TRIP_DETAILS)
      return setStepForm(StepForm.ADD_EMAILS);

    Alert.alert("Nova viagem", "Confirmar viagem?", [
      {
        text: "Não",
        style: "cancel",
      },
      {
        text: "Sim",
        onPress: handleCreateTrip,
      },
    ]);
  }

  function handleSelectedDate(selectedDay: DateData) {
    const dates = calendarUtils.orderStartsAtAndEndsAt({
      startsAt: selectedDates.startsAt,
      endsAt: selectedDates.endsAt,
      selectedDay,
    });

    setSelectedDates(dates);
  }

  function handleRemoveEmail(emailToRemove: string) {
    setEmailsToInvite((prevState) =>
      prevState.filter((email) => email !== emailToRemove)
    );
  }

  function handleAddEmail() {
    if (!validateInput.email(emailToInvite))
      return Alert.alert("Convidado", "E-mail inválido");

    const emailAlreadyExists = emailsToInvite.find(
      (email) => email === emailToInvite
    );

    if (emailAlreadyExists)
      return Alert.alert("Convidado", "Este e-mail ja foi adicionado!");

    setEmailsToInvite((prevState) => [...prevState, emailToInvite]);
    setEmailToInvite("");
  }

  async function saveTrip(tripId: string) {
    try {
      await tripStorage.save(tripId);
      router.navigate("/trip/" + tripId);
    } catch (error) {
      Alert.alert(
        "Salvar viagem",
        "Não foi possivel salvar o ID da viagem no dispositivo."
      );
      console.log(error);
    }
  }

  async function handleCreateTrip() {
    try {
      setIsCreatingTrip(true);
      const newTrip = await tripServer.createTrip({
        destination,
        emails_to_invite: emailsToInvite,
        starts_at: dayjs(selectedDates.startsAt?.dateString).toString(),
        ends_at: dayjs(selectedDates.endsAt?.dateString).toString(),
      });

      Alert.alert("Nova viagem", "Viagem criada com sucesso", [
        { text: "OK. Continuar", onPress: () => saveTrip(newTrip.tripId) },
      ]);
    } catch (error) {
      console.log(error);
      setIsCreatingTrip(false);
    }
  }

  async function getTrip() {
    try {
      const tripId = await tripStorage.get();

      if (!tripId) return setIsCreatingTrip(false);

      const trip = await tripServer.getTripById(tripId);

      if (trip) return router.navigate("/trip/" + trip.id);
    } catch (error) {
      setIsGettingTrip(false);
      console.log(error);
    }
  }

  useEffect(() => {
    getTrip();
  }, []);

  if (isGettingTrip) return <Loading />;

  return (
    <View className="flex-1 items-center justify-center px-5 gap-8">
      <View>
        <Image
          source={require("@/assets/logo.png")}
          className="h-8"
          resizeMode="contain"
        />

        <Image source={require("@/assets/bg.png")} className="absolute" />
        <Text className="text-zinc-400 font-regular text-center text-lg mt-3">
          Convide seus amigos e planeje sua{"\n"}próxima viagem
        </Text>
      </View>

      <View className="w-full bg-zinc-900 p-4 rounded-lg m-y8 border border-zinc-800 ">
        <Input variant="primary">
          <MapPin color={colors.zinc[400]} size={20} />
          <Input.Field
            placeholder="Para onde?"
            editable={stepForm === StepForm.TRIP_DETAILS}
            onChangeText={setDestination}
            value={destination}
          />
        </Input>

        <Input variant="primary">
          <IconCalendar color={colors.zinc[400]} size={20} />
          <Input.Field
            placeholder="Quando?"
            editable={stepForm === StepForm.TRIP_DETAILS}
            onFocus={() => Keyboard.dismiss()}
            showSoftInputOnFocus={false}
            onPressIn={() =>
              stepForm === StepForm.TRIP_DETAILS &&
              setShowModal(ModalEnum.CALENDAR)
            }
            value={selectedDates.formatDatesInText}
          />
        </Input>

        {stepForm === StepForm.ADD_EMAILS && (
          <>
            <View className="border-b py-3 border-zinc-800">
              <Button
                variant="secondary"
                className="w-full"
                onPress={() => setStepForm(StepForm.TRIP_DETAILS)}
              >
                <Button.Title>Alterar local/data</Button.Title>
                <Settings2 color={colors.zinc[200]} size={20} />
              </Button>
            </View>

            <Input variant="primary">
              <UserRoundPlus color={colors.zinc[400]} size={20} />
              <Input.Field
                placeholder="Quem estará na viagem?"
                autoCorrect={false}
                value={
                  emailsToInvite.length > 0
                    ? `${emailsToInvite.length} pessoa(s) convidada(s)`
                    : ""
                }
                onPressIn={() => {
                  Keyboard.dismiss();
                  setShowModal(ModalEnum.GUESTS);
                }}
                showSoftInputOnFocus={false}
              />
            </Input>
          </>
        )}

        <Button
          onPress={handleNextStepForm}
          isLoading={isCreatingTrip}
          className="w-full"
        >
          <Button.Title>
            {stepForm === StepForm.TRIP_DETAILS
              ? "Continuar"
              : "Confirmar viagem"}
          </Button.Title>
          <ArrowRight color={colors.lime[950]} size={20} />
        </Button>
      </View>

      <Text className="text-zinc-500 font-regular text-center text-base">
        Ao planejar sua viagem pela plann.er você automaticamente concorda com
        nossos{" "}
        <Text className="text-zinc-300 underline">
          termos de uso e políticas de privacidade.
        </Text>
      </Text>

      <Modal
        title="Selecionar datas"
        subtitle="Selecione a data de ida e volta da viagem"
        visible={showModal === ModalEnum.CALENDAR}
        onClose={() => setShowModal(ModalEnum.NONE)}
      >
        <View className="gap-4 mt-4">
          <Calendar
            onDayPress={handleSelectedDate}
            markedDates={selectedDates.dates}
            minDate={dayjs().toISOString()}
          />
          <Button
            onPress={() => setShowModal(ModalEnum.NONE)}
            className="w-full"
          >
            <Button.Title>Confirmar</Button.Title>
          </Button>
        </View>
      </Modal>

      <Modal
        title="Selecionar convidados"
        subtitle="Os convidados irão receber e-mails para confirmar a participação na viagem."
        visible={showModal === ModalEnum.GUESTS}
        onClose={() => setShowModal(ModalEnum.NONE)}
      >
        <View className="my-2 flex-wrap gap-2 border-b border-zinc-800 py-5 items-start">
          {emailsToInvite.length > 0 ? (
            emailsToInvite.map((email) => {
              return (
                <GuestEmail
                  key={email}
                  email={email}
                  onRemove={() => {
                    handleRemoveEmail(email);
                  }}
                />
              );
            })
          ) : (
            <Text className="text-zinc-600 text-base font-regular">
              Nenhum email adicionado.
            </Text>
          )}
        </View>
        <View className="gap-4 mt-4">
          <Input variant="secondary">
            <AtSign color={colors.zinc[400]} size={20} />
            <Input.Field
              placeholder="Digite o e-mail do convidado"
              keyboardType="email-address"
              onChangeText={(text) => setEmailToInvite(text)}
              value={emailToInvite}
              returnKeyType="send"
              onSubmitEditing={handleAddEmail}
            />
          </Input>

          <Button onPress={handleAddEmail} className="w-full">
            <Button.Title>Convidar</Button.Title>
          </Button>
        </View>
      </Modal>
    </View>
  );
}
