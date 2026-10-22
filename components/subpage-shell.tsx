import {SiteHeader,SiteFooter} from './site-chrome';
export default function SubpageShell({children}:{children:React.ReactNode}){return <div className="sn-site"><SiteHeader/><main id="main" className="sn-main">{children}</main><SiteFooter/></div>}
