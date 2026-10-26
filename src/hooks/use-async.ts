import { useCallback, useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react';

import { isBackendConfigured } from '@/lib/config';

export type AsyncState<T> = {
  data: T | null;
  loading: boolean;
  error: unknown;
  refetch: () => void;
  setData: Dispatch<SetStateAction<T | null>>;
};

/**
 * Loads data from the CareBase backend with a consistent loading/error/retry shape.
 * When the backend is not configured, it resolves to an empty (non-loading) state so
 * screens can render an honest "waiting for backend" message instead of placeholders.
 */
export function useAsync<T>(loader: () => Promise<T>, deps: readonly unknown[] = []): AsyncState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(() => isBackendConfigured());
  const [error, setError] = useState<unknown>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const loaderRef = useRef(loader);
  useEffect(() => {
    loaderRef.current = loader;
  }, [loader]);

  useEffect(() => {
    if (!isBackendConfigured()) {
      setData(null);
      setError(null);
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);
    setError(null);

    loaderRef
      .current()
      .then((result) => {
        if (active) setData(result);
      })
      .catch((err: unknown) => {
        if (active) {
          setError(err);
          setData(null);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, reloadKey]);

  const refetch = useCallback(() => setReloadKey((key) => key + 1), []);

  return { data, loading, error, refetch, setData };
}

export type MutationState<TResult, TArgs extends unknown[]> = {
  run: (...args: TArgs) => Promise<TResult>;
  loading: boolean;
  error: unknown;
  reset: () => void;
};

/** Runs a write action (POST/PATCH/PUT) with in-flight and error tracking. */
export function useMutation<TResult, TArgs extends unknown[] = []>(
  action: (...args: TArgs) => Promise<TResult>,
): MutationState<TResult, TArgs> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const actionRef = useRef(action);
  useEffect(() => {
    actionRef.current = action;
  }, [action]);

  const run = useCallback(async (...args: TArgs): Promise<TResult> => {
    setLoading(true);
    setError(null);
    try {
      return await actionRef.current(...args);
    } catch (err: unknown) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => setError(null), []);

  return { run, loading, error, reset };
}
