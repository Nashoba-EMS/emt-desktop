export type ApiResponse<T> = { success: true; data: T } | { success: false; errorMessage: string };
