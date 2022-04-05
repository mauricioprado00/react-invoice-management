import { useRouter } from "next/router";
import { useCallback } from "react";

type UrlParam = string | string[] | undefined;

export const useGoBack = () => {
  const router = useRouter();
  return useCallback(() => {
    router.back();
  }, [router]);
};

export const useGoRoute = (url: string) => {
  const router = useRouter();
  return useCallback(() => {
    router.push(url);
  }, [router, url]);
};

export const useIsRoute = (path: string) => {
  const router = useRouter();
  return path === router.pathname;
};

export const useParamId = (): string | null => {
  const router = useRouter();
  if (router.query.id) {
    return router.query.id.toString();
  }
  return null;
};

export const useRouterParams = () => {
  const router = useRouter();
  return router.query;
};

export const useGoEdit = (url: string, params?: Record<string, string>) => {
  const router = useRouter();
  const cb = useCallback(
    (id: string | null = null) => {
      if (id) {
        router.push(
          url + "?" + new URLSearchParams(Object.assign({ id }, params))
        );
      } else {
        router.push(url + (params ? "?" + new URLSearchParams(params) : ""));
      }
    },
    [router, url, params]
  );

  return cb;
};

export const useGoEditId = (url: string) => {
  const router = useRouter();
  return useCallback(
    (id: string | null = null) => {
      return () => {
        if (id) {
          router.push(url + "?" + new URLSearchParams({ id }));
        } else {
          router.push(url);
        }
      };
    },
    [router, url]
  );
};

export const useUrlParam = <T extends UrlParam>(
  name: string,
  def?: T
): [T, (value: T) => void] => {
  const router = useRouter();
  const param = router.query[name] || def;
  const setParam = useCallback(
    (newValue: T) => {
      const query = Object.assign({}, router.query, { [name]: newValue });
      if (newValue === def) {
        delete query[name];
      }
      router.replace({ query });
    },
    [def, name, router]
  );
  return [param as T, setParam];
};

export const usePagination = (): [
  number,
  (page: number) => void,
  (event: any, page: number) => void
] => {
  const router = useRouter();
  const page = router.query.page ? parseInt(router.query.page.toString()) : 1;
  const setPage = useCallback(
    (page: number) => {
      const query = Object.assign({}, router.query, { page: page.toString() });
      router.replace({ query }, undefined, { scroll: false });
    },
    [router]
  );
  const handlePageChange = useCallback(
    (event: any, page: number) => {
      setPage(page);
    },
    [setPage]
  );
  return [page, setPage, handlePageChange];
};
