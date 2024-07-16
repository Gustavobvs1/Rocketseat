import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Modal } from "@/components/modal";
import { Participant, ParticipantProps } from "@/components/participant";
import { TripLink, TripLinkProps } from "@/components/trip-link";
import { linksServer } from "@/server/links-server";
import { participantsServer } from "@/server/participants-server";
import { colors } from "@/styles/colors";
import { validateInput } from "@/utils/validate-input";
import { Link2, Plus, Tag } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Alert, FlatList, Text, View } from "react-native";

interface DetailsProps {
  tripId: string;
}

export function Details({ tripId }: DetailsProps) {
  const [isCreatingLinkTrip, setIsCreatingLinkTrip] = useState(false);

  const [showLinkModal, setShowLinkModal] = useState(false);

  const [linkName, setLinkName] = useState("");
  const [linkUrl, setLinkUrl] = useState("");

  const [linksList, setLinksList] = useState<TripLinkProps[]>([]);
  const [participantsList, setParticipantsList] = useState<ParticipantProps[]>(
    []
  );

  function resetNewLinkFields() {
    setLinkName("");
    setLinkUrl("");
    setShowLinkModal(false);
  }

  async function handleCreateTripLink() {
    try {
      if (!linkName.trim())
        return Alert.alert("Link", "Informe um titulo para o link");

      if (!validateInput.url(linkUrl.trim()))
        return Alert.alert("Link", "Link invalido!");

      setIsCreatingLinkTrip(true);

      await linksServer.createLink({
        tripId,
        title: linkName,
        url: linkUrl,
      });

      Alert.alert("Novo link", "Link criado com sucesso!");
      resetNewLinkFields();

      await getTripLinks();
    } catch (error) {
      console.log(error);
    } finally {
      setIsCreatingLinkTrip(false);
    }
  }

  async function getTripLinks() {
    try {
      const links = await linksServer.getLinksByTripId(tripId);
      setLinksList(links);
    } catch (error) {
      console.log(error);
    }
  }

  async function getTripParticipants() {
    try {
      const participants = await participantsServer.getByTripId(tripId);
      setParticipantsList(participants);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getTripLinks();
    getTripParticipants();
  }, []);

  return (
    <View className="flex-1 mt-10">
      <Text className="text-zinc-50 text-2xl font-semibold mb-2">
        Links importantes
      </Text>

      <View className="flex-1">
        {linksList.length > 0 ? (
          <FlatList
            data={linksList}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <TripLink data={item} />}
            contentContainerClassName="gap-4"
          />
        ) : (
          <Text className="font-regular text-base mt-2 mb-6 text-zinc-400">
            Nenhum link adicionado.
          </Text>
        )}

        <Button variant="secondary" onPress={() => setShowLinkModal(true)}>
          <Plus size={20} color={colors.zinc[200]} />
          <Button.Title>Cadastrar novo link</Button.Title>
        </Button>
      </View>

      <View className="flex-1 border-t border-zinc-800 mt-6">
        <Text className="text-zinc-50 text-2xl font-semibold my-6">
          Convidados
        </Text>

        <FlatList
          data={participantsList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <Participant data={item} />}
          contentContainerClassName="gap-4 pb-44"
        />
      </View>

      <Modal
        title="Cadastrar link"
        subtitle="Todos os convidados podem visualizar os links importantes."
        visible={showLinkModal}
        onClose={() => setShowLinkModal(false)}
      >
        <View className="gap-2 mb-3">
          <Input variant="secondary">
            <Tag color={colors.zinc[400]} size={20} />
            <Input.Field
              placeholder="Titulo do link"
              onChangeText={setLinkName}
              value={linkName}
            />
          </Input>

          <Input variant="secondary">
            <Link2 color={colors.zinc[400]} size={20} />
            <Input.Field
              placeholder="URL"
              onChangeText={setLinkUrl}
              value={linkUrl}
            />
          </Input>
        </View>

        <Button isLoading={isCreatingLinkTrip} onPress={handleCreateTripLink}>
          <Button.Title>Salvar link</Button.Title>
        </Button>
      </Modal>
    </View>
  );
}
