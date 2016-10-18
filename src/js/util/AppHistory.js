import { createHashHistory } from 'history'
import { useRouterHistory } from "react-router";


//If we find that we need more persistent state remove the queryKey: false
const appHistory = useRouterHistory(createHashHistory)({ queryKey: false})
export default appHistory
