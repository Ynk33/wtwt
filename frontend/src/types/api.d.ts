export type ApiResponse<T> = {
  status: 'success' | 'error';
  data: {
    data?: T;
    error?: string;
  };
};
