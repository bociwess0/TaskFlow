import type { UserSummary } from "@/types/user";

/** Mock users shared by all mock services, so the same person has the same id everywhere. */
export const mockUsers = {
  bogdan: { id: "u-1", name: "Bogdan Djordjevic" },
  ana: { id: "u-2", name: "Ana Markovic" },
  marko: { id: "u-3", name: "Marko Petrovic" },
  jelena: { id: "u-4", name: "Jelena Ilic" },
  nikola: { id: "u-5", name: "Nikola Radovic" },
  sara: { id: "u-6", name: "Sara Jovanovic" },
  ivan: { id: "u-7", name: "Ivan Stojanovic" },
} satisfies Record<string, UserSummary>;
