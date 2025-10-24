import queryClient from "@/constants/queryClient";
import {
  addPriceBook,
  useGetPrices,
  type IAddPriceBook,
  type IAddPriceBookRule,
  type IPrices,
} from "@/states/apis/prices";
import { generateId } from "@/utils/strings";
import { addToast, Button, useDisclosure } from "@heroui/react";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import PriceHeaderInfoModal from "./components/PriceHeaderInfoModal";
import PriceItem from "./components/PriceItem";
import { PriceErrorMessages } from "./constant";

const Prices = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data: dataPrices } = useGetPrices();

  const [priceBooks, setPriceBooks] = useState<IPrices[]>([]);

  const [newPriceBook, setNewPriceBook] = useState<IAddPriceBook | null>(null);

  useEffect(() => {
    if (dataPrices && dataPrices.length > 0) {
      setPriceBooks(JSON.parse(JSON.stringify(dataPrices)));
    }
  }, [dataPrices]);

  const handleDuplicatePriceBook = (priceBookId: string) => {
    const priceBookIndex = priceBooks.findIndex((pb) => pb.id === priceBookId);
    if (priceBookIndex !== -1) {
      const priceBookToDuplicate = priceBooks[priceBookIndex];
      const duplicatedPriceBook = {
        ...priceBookToDuplicate,
        priceBookTitle: `${priceBookToDuplicate.priceBookTitle} (Copy)`,
        priceBookId: `${priceBookToDuplicate.priceBookId} (Copy)`,
        rules: priceBookToDuplicate.rules.map((rule) => ({
          ...rule,
          _id: generateId(),
        })),
      };
      setNewPriceBook(duplicatedPriceBook);
      setTimeout(() => onOpen(), 1000);
    }
  };

  const { mutate } = useMutation({
    mutationFn: addPriceBook,
    onSuccess: () => {
      addToast({
        title: "Create price book successfully",
        color: "success",
        timeout: 2000,
        isClosing: true,
      });
      queryClient.invalidateQueries({ queryKey: ["prices"] });
      if (newPriceBook) {
        setNewPriceBook(null);
      }
      onClose();
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        const errorCode = error.response?.data?.code;
        const msg = PriceErrorMessages[errorCode] ?? "Something went wrong";
        addToast({
          title: msg,
          color: "danger",
          timeout: 2000,
          isClosing: true,
        });
      } else {
        addToast({
          title: "Update price book failed",
          color: "danger",
          timeout: 2000,
          isClosing: true,
        });
      }
    },
  });

  const handleAddNewPriceBook = ({
    title,
    externalId,
    rules,
  }: {
    title: string;
    externalId: string;
    rules?: IAddPriceBookRule[];
  }) => {
    const newPriceBook: IAddPriceBook = {
      priceBookId: externalId,
      priceBookTitle: title,
      rules: rules
        ? rules
        : [
            {
              dayOfWeek: "weekdays",
              timeFrom: 0,
              timeTo: 1380,
              perHour: 0,
              referenceNumberHour: 0,
              perKm: 0,
              referenceNumberKm: 0,
              effectiveDate: new Date().toISOString(),
            },
          ],
    };

    mutate(newPriceBook);
  };

  return (
    <div className="container mx-auto mb-10 pt-4">
      <div className="flex items-center justify-between">
        <span className="text-2xl">Prices</span>
        <Button
          onPress={onOpen}
          color="primary"
          startContent={<PlusIcon size={16} />}
        >
          Add New
        </Button>
      </div>
      <div className="h-12"></div>

      {priceBooks &&
        priceBooks?.map((dataPrice: IPrices, index: number) => (
          <PriceItem
            handleDuplicatePriceBook={handleDuplicatePriceBook}
            key={`${dataPrice.id}-${index}`}
            dataPrice={dataPrice}
          />
        ))}

      <PriceHeaderInfoModal
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={({ title, externalId }) => {
          if (newPriceBook) {
            handleAddNewPriceBook({
              ...newPriceBook,
              title,
              externalId,
            });
          } else {
            handleAddNewPriceBook({ title, externalId });
          }
        }}
        mode={newPriceBook ? "duplicate" : "add"}
        priceBookTitle={
          newPriceBook?.priceBookTitle ? newPriceBook.priceBookTitle : ""
        }
        priceBookId={newPriceBook?.priceBookId ? newPriceBook.priceBookId : ""}
      />
    </div>
  );
};

export default Prices;
