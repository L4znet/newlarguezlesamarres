import TransactionRepository from "@/modules/domain/transactions/TransactionRepository"
import { TransactionIdResponseDTO } from "@/modules/domain/transactions/DTO/TransactionIdResponseDTO"

export const updateTransactionUseCase = async (transactionRepository: TransactionRepository, offerId: string): Promise<TransactionIdResponseDTO | undefined> => {
     try {
          return await transactionRepository.updateTransactionOfferDeletedAt(offerId)
     } catch (error) {
          throw new Error((error as Error).message)
     }
}
