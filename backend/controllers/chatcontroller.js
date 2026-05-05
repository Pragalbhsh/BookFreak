const getMyChats = async (req, res) => {
    const userId = req.user._id.toString()
    // get logged in user's ID
    // .toString() = convert MongoDB ID to string

    const messages = await Message.find({
        roomId: { $regex: userId }
        // $regex = search inside string
        // finds all messages where roomId CONTAINS userId
        // roomId looks like "abc123_def456"
        // if userId = "abc123" → this finds it!
    })
    .sort({ createdAt: -1 })
    // -1 = newest first

    // rooms = object to store last message of each room
    const rooms = {}
    messages.forEach(msg => {
        if(!rooms[msg.roomId]) {
            // if we haven't seen this room yet
            rooms[msg.roomId] = msg
            // save this message as the last one
            // (already sorted newest first so first one = last message)
        }
    })
    // Result: { "abc_def": lastMessage, "abc_xyz": lastMessage }

    // for each room find the OTHER person
    const chats = await Promise.all(
        Object.values(rooms).map(async (msg) => {
            // Object.values = get array of values from object
            // Promise.all = wait for ALL async operations

            const ids = msg.roomId.split('_')
            // roomId = "abc123_def456"
            // split('_') = ["abc123", "def456"]

            const otherId = ids.find(id => id !== userId)
            // find the ID that is NOT mine
            // that's the other person!

            const otherUser = await User.findById(otherId)
                .select('name avatar')
            // get other person's name and avatar

            return {
                roomId: msg.roomId,
                otherUser,           // their name/avatar
                lastMessage: msg.message,  // last message text
                sellerId: otherId    // their ID (for navigation)
            }
        })
    )

    res.status(200).json(chats)
}