const chat = document.querySelector(".chat")
const chatForm = chat.querySelector(".chatForm")
const chatInput = chat.querySelector(".chatInput")
const chatMessages = chat.querySelector(".chatMensagem")

const colors = ["cadetblue", "darkgoldenrod", "cornflowerblue", "darkkhaki", "hotpink", "gold", "tomato", "mediumseagreen", "slateblue", "peru", "lightcoral", "plum", "steelblue", "darkslategray", "indianred", "forestgreen", "darkcyan", "orangered", "mediumvioletred", "lightseagreen"];

const user = { id: "", name: "", color: "" }

let websocket

const createMessageSelfElement = (content) => {
    const div = document.createElement("div")

    div.classList.add("message--self")
    div.innerHTML = content

    return div
}

const createMessageOtherElement = (content, sender, senderColor, senderPhoto) => {
    const div = document.createElement("div")
    const span = document.createElement("span")
    const img = document.createElement("img")

    div.classList.add("message--other")

    img.src = senderPhoto
    img.alt = sender
    img.style.width = '50px'
    img.style.height = '50px'
    img.style.borderRadius = '100%'
    img.style.marginRight = '10px'

    span.classList.add("message--sender")
    span.style.color = senderColor

    div.appendChild(img)
    div.appendChild(span)

    span.innerHTML = sender
    div.innerHTML += content

    return div
}

const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length)
    return colors[randomIndex]
}

const scrollScreen = () => {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
    })
}

const processMessage = ({ data }) => {
    const { userId, userName, userColor, content, userPhoto } = JSON.parse(data)

    const message =
        userId == user.id
            ? createMessageSelfElement(content)
            : createMessageOtherElement(content, userName, userColor, userPhoto)

    chatMessages.appendChild(message)

    scrollScreen()
}

const Login = async () => {
    try {
        const response = await fetch('https://randomuser.me/api/')
        const data = await response.json()
        const person = data.results[0]

        user.id = crypto.randomUUID()
        user.name = `${person.name.first} ${person.name.last}`
        user.photo = person.picture.large
        user.color = getRandomColor()

        websocket = new WebSocket("wss://api-ifsc.onrender.com")
        websocket.onmessage = processMessage
    } catch (error) {
        console.error("Erro ao buscar dados da API:", error)
    }
}

const sendMessage = (event) => {
    event.preventDefault()

    const message = {
        userId: user.id,
        userName: user.name,
        userColor: user.color,
        content: chatInput.value,
        userPhoto: user.photo
    }

    websocket.send(JSON.stringify(message))

    chatInput.value = ""
}

window.addEventListener("load", Login)
chatForm.addEventListener("submit", sendMessage)
