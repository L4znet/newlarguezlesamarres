import TransactionRepository from "@/modules/domain/transactions/TransactionRepository"
import { TransactionIdResponseDTO } from "@/modules/domain/transactions/DTO/TransactionIdResponseDTO"
import supabase from "@/supabaseClient"
import { UpdateTransactionDeletedAtDTO } from "@/modules/domain/transactions/DTO/UpdateTransactionDeletedAtDTO"

export default class TransactionRepositorySupabase implements TransactionRepository {
     async updateTransactionOfferDeletedAt(offerId: string): Promise<TransactionIdResponseDTO | undefined> {
          try {
               const updateOfferDTO = new UpdateTransactionDeletedAtDTO(new Date(), null)

               console.log("Je suis là")

               const {
                    data: offerIdResponse,
                    error
               }: {
                    data: { id: string } | null
                    error: any
               } = await supabase.from("transactions").update(UpdateTransactionDeletedAtDTO.toRawData(updateOfferDTO)).eq("offer_id", offerId).select("id").single()

                         console.log(offerId)
                         console.log(offerIdResponse)
                         console.log(error)

               if (offerIdResponse) {
                    console.log("sfdlkfsdmlkjfd")
                    return TransactionIdResponseDTO.fromRawData(offerIdResponse)
               } else {
                    console.log("fdsmkfdslkjm")
               }
          } catch (error) {
               console.log("ceci est un test")

               throw new Error((error as Error).message)
          }
     }
}
