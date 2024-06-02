export const formatDate = (date: string) => {
  return `${date.slice(8, 10)}/${date.slice(5, 7)}/${date.slice(0, 4)} - ${date.slice(11, 16)}`;
};

export const saveToken = (token: string) => {
  localStorage.setItem("token", token);
};
