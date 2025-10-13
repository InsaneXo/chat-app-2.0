import axios from "axios";
import { useState, useEffect, useRef } from "react";

interface messageListType {
    _id: string;
    sender: string;
    content: string;
    messageType: string;
    seenBy: [];
    createdAt: string;
}

const useInfiniteChatScroll = (chatId: string, limit: number = 10) => {
    const [error, setError] = useState<string>("")
    const [page, setPage] = useState<number>(1)
    const [loading, setLoading] = useState<boolean>(false)
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [messageList, setMessageList] = useState<messageListType[]>([])
    const containerRef = useRef<HTMLDivElement>(null);


    const fetchMessages = async () => {
        if (loading || !hasMore) return;
        setLoading(true);
        try {
            const { data } = await axios.get(`/api/chat/message`, {
                params: {
                    chatId,
                    page,
                    limit,
                },
            });
            const newMessages: messageListType[] = data.messages || [];
            const container = containerRef.current;
            const scrollHeightBefore = container?.scrollHeight || 0;

            setMessageList((prev) => [...newMessages, ...prev]);
            setHasMore(newMessages.length > 0);
            setPage((prev) => prev + 1);

            requestAnimationFrame(() => {
                if (container) {
                    const scrollHeightAfter = container.scrollHeight;
                    container.scrollTop = scrollHeightAfter - scrollHeightBefore;
                }
            })
        } catch (error: any) {
            if (error) {
                setError(error.response.data.message)
            }
        } finally {
            setLoading(false)
        }
    }

    const handleScroll = () => {
        const container = containerRef.current;
        if (!container) return;
        if (container.scrollTop === 0 && !loading) {
            fetchMessages();
        }
    };

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        container.addEventListener("scroll", handleScroll);
        return () => container.removeEventListener("scroll", handleScroll);
    }, [loading, hasMore]);

    return {
        messageList,
        error,
        loading,
        hasMore,
        containerRef,
        fetchMessages,
        setMessageList,
    }
}

export default useInfiniteChatScroll