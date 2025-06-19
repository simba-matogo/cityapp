/**
 * Retry a function with exponential backoff
 * 
 * @param operation Function to retry
 * @param retryCount Maximum number of retries
 * @param delayMs Initial delay in milliseconds
 * @returns Result of the operation
 */
export async function retryWithBackoff<T>(
  operation: () => Promise<T>, 
  retryCount = 3, 
  delayMs = 300
): Promise<T> {
  let currentTry = 0;
  
  while (true) {
    try {
      return await operation();
    } catch (error: any) {
      currentTry++;
      
      // If we've reached max retries or this isn't a network error
      if (
        currentTry >= retryCount || 
        !(error.name === 'FirebaseError' || 
          error.code === 'unavailable' || 
          error.message?.includes('network') ||
          error.message?.includes('disconnected') ||
          error.message?.includes('timeout'))
      ) {
        throw error;
      }
      
      // Exponential backoff with jitter
      const delay = delayMs * Math.pow(2, currentTry - 1) * (0.5 + Math.random() * 0.5);
      console.log(`Retrying after ${Math.round(delay)}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

/**
 * Timeout a promise after specified milliseconds
 * 
 * @param promise Promise to timeout
 * @param timeoutMs Timeout in milliseconds
 * @param errorMessage Custom error message
 * @returns Promise that rejects if timeout occurs
 */
export function timeoutPromise<T>(
  promise: Promise<T>, 
  timeoutMs: number, 
  errorMessage = 'Operation timed out'
): Promise<T> {
  let timeoutHandle: number;
  
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutHandle = setTimeout(() => {
      reject(new Error(errorMessage));
    }, timeoutMs);
  });

  return Promise.race([
    promise,
    timeoutPromise
  ]).then(result => {
    clearTimeout(timeoutHandle);
    return result as T;
  }, error => {
    clearTimeout(timeoutHandle);
    throw error;
  });
}
