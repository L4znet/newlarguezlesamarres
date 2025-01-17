import React from "react"
import { render, fireEvent, waitFor } from "@testing-library/react-native"
import { useCreateOffer } from "@/modules/hooks/offers/useCreateOffer"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"
import CreateOffer from "@/app/(app)/(tabs)/(home)/createOffer"
import { useRouter } from "expo-router"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { TranslationContext } from "@/modules/context/TranslationContext"

jest.mock("@/modules/hooks/offers/useCreateOffer", () => ({
     useCreateOffer: jest.fn(),
}))

jest.mock("@/modules/context/FlashMessageProvider", () => ({
     useFlashMessage: jest.fn(),
}))

jest.mock("expo-router", () => ({
     useRouter: jest.fn(),
}))

const MockQueryClientProvider: React.FC = ({ children }) => {
     const queryClient = new QueryClient({
          defaultOptions: {
               queries: {
                    retry: false,
               },
          },
     })

     return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

const MockTranslationProvider: React.FC = ({ children }) => {
     const mockTranslation = {
          t: (key: string) => key,
     }

     return <TranslationContext.Provider value={mockTranslation}>{children}</TranslationContext.Provider>
}

// Tests
describe("CreateOffer Screen Integration Tests", () => {
     const mockCreateOffer = jest.fn()
     const mockShowFlashMessage = jest.fn()
     const mockRouter = { navigate: jest.fn() }

     beforeEach(() => {
          // Mock des hooks
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
               <MockQueryClientProvider>
                    <MockTranslationProvider>
                         <CreateOffer />
                    </MockTranslationProvider>
               </MockQueryClientProvider>
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
          const { getByText, getByPlaceholderText } = render(
               <MockQueryClientProvider>
                    <MockTranslationProvider>
                         <CreateOffer />
                    </MockTranslationProvider>
               </MockQueryClientProvider>
          )

          const titleInput = getByPlaceholderText("Enter title")
          fireEvent.changeText(titleInput, "Test Offer")

          const descriptionInput = getByPlaceholderText("Enter description")
          fireEvent.changeText(descriptionInput, "This is a test offer description.")

          const priceInput = getByPlaceholderText("Enter price")
          fireEvent.changeText(priceInput, "100")

          const submitButton = getByText("Create Offer")
          fireEvent.press(submitButton)

          mockCreateOffer.mockImplementation((data, { onSuccess }) => {
               onSuccess()
          })

          await waitFor(() => {
               expect(mockCreateOffer).toHaveBeenCalledWith({
                    title: "Test Offer",
                    description: "This is a test offer description.",
                    price: "100",
                    rentalPeriod: undefined, // Ou ajustez selon votre implémentation
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

               expect(mockShowFlashMessage).toHaveBeenCalledWith("success", {
                    title: "Success",
                    description: "Offer created successfully.",
               })

               expect(mockRouter.navigate).toHaveBeenCalledWith("/(app)/(tabs)/(home)")
          })
     })

     test("Displays flash message on submission error", async () => {
          const { getByText, getByPlaceholderText } = render(
               <MockQueryClientProvider>
                    <MockTranslationProvider>
                         <CreateOffer />
                    </MockTranslationProvider>
               </MockQueryClientProvider>
          )

          const titleInput = getByPlaceholderText("Enter title")
          fireEvent.changeText(titleInput, "Test Offer")

          const descriptionInput = getByPlaceholderText("Enter description")
          fireEvent.changeText(descriptionInput, "Description")

          const priceInput = getByPlaceholderText("Enter price")
          fireEvent.changeText(priceInput, "100")

          const submitButton = getByText("Create Offer")
          fireEvent.press(submitButton)

          mockCreateOffer.mockImplementation((data, { onError }) => {
               onError(new Error("Network error"))
          })

          await waitFor(() => {
               expect(mockShowFlashMessage).toHaveBeenCalledWith("danger", {
                    title: "Error",
                    description: "An error occurred while creating the offer.",
               })
          })
     })
})
