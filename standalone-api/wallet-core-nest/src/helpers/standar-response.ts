export type standarResponseType = {
  data: any;
  success: boolean;
  code_error: number;
  message_error: string;
};

export const standarResponse = (
  data: any,
  success: boolean = true,
  code_error: number = 0,
  message_error: string = '',
): standarResponseType => {
  return {
    success: success,
    code_error: code_error,
    message_error: message_error,
    data,
  };
};
