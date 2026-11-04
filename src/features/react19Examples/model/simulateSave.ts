export async function simulateSave<T>(value: T, failureRate = 0): Promise<T> {
  await new Promise<void>((resolve) => setTimeout(resolve, 1000));
  if (failureRate > 0 && Math.random() < failureRate) {
    throw new Error("Сервер отказал в сохранении.");
  }
  return value;
}
