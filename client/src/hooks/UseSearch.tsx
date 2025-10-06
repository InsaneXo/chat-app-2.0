import axios from "axios";
import { useState, useEffect } from "react";

interface UseSearchReturn<T> {
    query: string;
    setQuery: (value: string) => void;
    results: T[];
    loading: boolean;
    error: string
}

const useSearch = <T = any>(apiUrl: string, delay = 500): UseSearchReturn<T> => {
    const [query, setQuery] = useState<string>("");
    const [results, setResults] = useState<T[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error,setError] = useState<string>("")

    useEffect(() => {
        if (!query) {
            setResults([]);
            setLoading(false);
            return;
        }

        const handler = setTimeout(async () => {
            try {
                setLoading(true);
                const { data } = await axios({
                    url: `${apiUrl}?name=${query}`,

                })
                setResults(data.user || []);
            } catch (err: any) {
                if (err) {
                    setError(err.response.data.message);
                }
            } finally {
                setLoading(false);
            }
        }, delay);

        return () => clearTimeout(handler);
    }, [query, apiUrl, delay]);

    return { query, setQuery, results, loading, error };
};

export default useSearch