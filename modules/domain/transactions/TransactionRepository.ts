import { TransactionIdResponseDTO } from "@/modules/domain/transactions/DTO/TransactionIdResponseDTO"

interface TransactionRepository {
     updateTransactionOfferDeletedAt(offerId: string): Promise<TransactionIdResponseDTO | undefined>
}

export default TransactionRepository
