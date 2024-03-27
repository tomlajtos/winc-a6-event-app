// React and React Router imports
import { useRef } from "react";
// Chakra-ui imports
import {
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
} from "@chakra-ui/react";
// Context and custom hook imports
import { useEditEvent } from "../../context/EditEventContext";
// Component imports
import { CancelEditButton } from "../../components/forms/buttons/CancelEditButton";
import { EventForm } from "../../components/forms/EventForm";
import { SaveEditButton } from "../../components/forms/buttons/SaveEditButton";
// Util and I/O imports
import { generateDateTimeStr } from "../../util/datetime";
import { handleErrorPromptResetOnModalClose } from "../../util/uiUtils";
import { toaster } from "../../util/toaster";

export const EditEventModal = () => {
  const { event, fetcher, editIsOpen, editOnClose, toast } = useEditEvent();
  const errors = fetcher.data?.errors;
  const toastIdRef = useRef(""); // ref to make toasts closable
  let formattedCatids;
  if (Array.isArray(event.categoryIds)) {
    formattedCatids = event.categoryIds.map((id) => id.toString());
  }
  if (typeof event.categoryIds === "string") {
    formattedCatids =
      event.categoryIds.length === 1
        ? [event.categoryIds]
        : event.categoryIds.split(",");
  }

  const defaultFormValues = {
    title: event.title,
    createdBy: event.createdBy,
    startTime: generateDateTimeStr(event.startTime),
    endTime: generateDateTimeStr(event.endTime),
    location: event.location,
    description: event.description,
    categoryIds: formattedCatids,
    image: event.image,
  };

  if (editIsOpen) {
    // toast
    toaster(toast, fetcher, toastIdRef);
    // setTimeout makes sure that there is no collision of component renders caused by the active toast and editOnClose function
    // without this there is a warning of state update while rendering another component
    // There should be a setTimout implemented in the toaster function as well
    if (fetcher.data?.success && fetcher.state === "loading") {
      setTimeout(() => {
        editOnClose();
        return null;
      }, 0);
    }
  }

  return (
    <Modal
      isOpen={editIsOpen}
      onClose={() =>
        handleErrorPromptResetOnModalClose(fetcher, event, editOnClose)
      }
      closeOnEsc
      size={["full", null, "lg"]}
    >
      <ModalOverlay
        bg="blackAlpha.600"
        backdropFilter="auto"
        backdropBlur="3px"
      >
        <ModalContent backgroundColor="whiteAlpha.900">
          <ModalHeader fontSize="2xl" background="transparent" px={[2, 3, 4]}>
            Edit event
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody background="transparent" px={[3, 6, 8]}>
            <Flex
              width="full"
              direction="column"
              alignItems="stretch"
              backgroundColor="transparent"
            >
              <EventForm
                as={fetcher.Form}
                id="edit-event-form"
                method="PATCH"
                defaultValues={defaultFormValues}
                errors={errors}
              />
              {/* edit-form button group */}
              <Stack
                direction="row"
                spacing={2}
                py={4}
                justifyContent="end"
                width="full"
              >
                <SaveEditButton errors={errors} />
                <CancelEditButton
                  onClick={() =>
                    handleErrorPromptResetOnModalClose(
                      fetcher,
                      event,
                      editOnClose,
                    )
                  }
                />
              </Stack>
            </Flex>
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};
