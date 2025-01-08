import { useQuery } from "@tanstack/react-query"
import { getBoatsUseCase } from "@/modules/application/boats/getBoatsUseCase"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"
import { getProfileUseCase } from "@/modules/application/profile/getProfileUseCase"
import { getCurrentSessionUseCase } from "@/modules/application/auth/getCurrentSessionUseCase"

export function useProfile() {
     return useQuery({
          queryKey: ["profile"],
          queryFn: () => getProfileUseCase(),
          refetchOnMount: true,
          refetchOnWindowFocus: true,
          refetchOnReconnect: true,
          staleTime: Infinity,
     })
}
