import { createContext } from "unctx"

const user = createContext({
    asyncContext: true,
})

export default {
    user,
}