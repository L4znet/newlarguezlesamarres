import React from "react"
import { render, fireEvent, waitFor } from "@testing-library/react-native"
import { MockTranslationProvider } from "@/modules/tests/config/test-utils"
import CreateOffer from "@/app/(app)/(tabs)/(home)/createOffer"
import { useCreateOffer } from "@/modules/hooks/offers/useCreateOffer"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"
import { useRouter } from "expo-router"

jest.mock("@/modules/hooks/offers/useCreateOffer", () => ({
     useCreateOffer: jest.fn(),
}))

jest.mock("/modules/lib/supabaseClient", () => jest.requireActual("../../../modules/tests/config/supabaseClientTest.ts"))

jest.mock("@/modules/context/FlashMessageProvider", () => ({
     useFlashMessage: jest.fn(),
}))

jest.mock("expo-router", () => ({
     useRouter: jest.fn(),
}))

describe("CreateOffer Screen Integration Tests", () => {
     const mockCreateOffer = jest.fn()
     const mockShowFlashMessage = jest.fn()
     const mockRouter = { navigate: jest.fn() }

     beforeEach(() => {
          ;(useCreateOffer as jest.Mock).mockReturnValue({
               mutate: mockCreateOffer,
               isPending: false,
          })
          ;(useFlashMessage as jest.Mock).mockReturnValue({
               showTranslatedFlashMessage: mockShowFlashMessage,
          })
          ;(useRouter as jest.Mock).mockReturnValue(mockRouter)

          jest.clearAllMocks()
     })

     test("Validates required fields and displays error messages", async () => {
          const { getByText, queryByText } = render(
               <MockTranslationProvider>
                    <CreateOffer />
               </MockTranslationProvider>
          )

          const submitButton = getByText("Create Offer")
          fireEvent.press(submitButton)

          await waitFor(() => {
               expect(queryByText("Title is required")).toBeTruthy()
               expect(queryByText("Description is required")).toBeTruthy()
               expect(queryByText("Price is required")).toBeTruthy()
               expect(queryByText("Rental period is required")).toBeTruthy()
          })
     })

     test("Submits the form with valid data", async () => {
          const { getByText, getByPlaceholderText, getByTestId } = render(
               <MockTranslationProvider>
                    <CreateOffer />
               </MockTranslationProvider>
          )

          const titleInput = getByPlaceholderText("Enter title")
          fireEvent.changeText(titleInput, "Test Offer")

          const descriptionInput = getByPlaceholderText("Enter description")
          fireEvent.changeText(descriptionInput, "This is a test offer description.")

          const priceInput = getByPlaceholderText("Enter price")
          fireEvent.changeText(priceInput, "100")

          const selectRentalButton = getByText("Select Rental Period")
          fireEvent.press(selectRentalButton)

          const rentalStartDateInput = getByTestId("rentalPeriodStart")
          const rentalEndDateInput = getByTestId("rentalPeriodEnd")

          fireEvent.changeText(rentalStartDateInput, "2025-01-01")
          fireEvent.changeText(rentalEndDateInput, "2025-01-05")

          const submitButton = getByText("Create Offer")
          fireEvent.press(submitButton)

          await waitFor(() => {
               expect(mockCreateOffer).toHaveBeenCalledWith({
                    title: "Test Offer",
                    description: "This is a test offer description.",
                    price: "100",
                    rentalPeriod: {
                         start: "2025-01-01",
                         end: "2025-01-05",
                    },
                    location: {
                         city: "",
                         country: "",
                         zipcode: "",
                         address: "",
                    },
                    selectedBoatId: null,
                    isAvailable: false,
                    isSkipperAvailable: false,
                    isTeamAvailable: false,
                    equipments: [],
               })
          })
     })
})
