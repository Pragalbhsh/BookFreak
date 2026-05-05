// useEffect fires when page loads
useEffect(() => {
    fetchChats()
}, [])

const fetchChats = async () => {
    const res = await api.get('/chats')
    // calls GET /api/chats
    // backend returns array of conversations
    setChats(res.data)
    // store in state → React shows them
}

// For each chat show:
chats.map((chat) => (
    <div onClick={() => navigate(`/chat/${chat.sellerId}`)}>
    // clicking a chat → goes to that conversation

        {chat.otherUser?.name}
        // show other person's name

        {chat.lastMessage}
        // show last message preview
        // like WhatsApp!
    </div>
))