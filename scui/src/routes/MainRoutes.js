import Footer from "../components/Footer";
import Header from "../components/Header";
import MainTable from "../components/Tables";
import { Outlet } from "react-router-dom";
import Mainpage from "../components/Mainpage";
import OrderHistory from "../components/Tables/OrderHistory";
import SideNav from "../components/Sidenav";
import Profiles from "../components/Mainpage/MyProfile/myprofile.js";
/**Dashboard */
import Dashboard from "../components/Mainpage/dashboard.js";
/**Module 1 */
import M1cncNesting from "../components/Mainpage/m1_cncNesting";
import M1cncPunching from "../components/Mainpage/m1_cncPunching";

/**Module 2 */
import M2tubeCutting from "../components/Mainpage/m2_tubeCutting";

/**Module 3 */
import M3finsPunching from "../components/Mainpage/m3_finsPunching";
import M3coilAssembly from "../components/Mainpage/m3_coilAssembly";
import M3coilExpansion from "../components/Mainpage/m3_coilExpansion";
/**Module 4 */
import M4brazingLeak from "../components/Mainpage/m4_brazingLeak";
import M4paintPacking from "../components/Mainpage/m4_paintPacking";
/**Module 5 */
import Dispatch from "../components/Mainpage/dispatch";
import FinishedStock from "../components/Mainpage/finishedStock";
import CreateCustomer from "../components/Mainpage/createCustomer.js";
import CustomerTable from "../components/Mainpage/customerTable";
import CreateOrder from "../components/Mainpage/createOrder";
import Login from "../components/Auth/login";
import Signup from "../components/Auth/signup";
import CreateAccessTypes from "../components/Mainpage/createAccessTypes.js";
import CreateUser from "../components/Mainpage/createUser";
import LookupEntry from "../components/Mainpage/lookupEntry";
import M1cncProgramMaster from "../components/Mainpage/m1_cncprogrammaster";
import M1epBending from "../components/Mainpage/m1_epBending";
import M1cncProgramMasterComplete  from  "../components/Mainpage/m1_cnc_complete"
/**Module 6 */
import Scheduler from "../components/Modules/Scheduler/index";
import ModuleAccess from "../components/Mainpage/ModuleAccess.js";

/**WIP */
import WIP_EP from "../components/Mainpage/WIP/wip_ep.js";
import WIP_Pipe from "../components/Mainpage/WIP/wip_pipe.js";
import WIP_Fins from "../components/Mainpage/WIP/wip_fins.js";
import CNCProgramMaster from "../components/Mainpage/CNCProgramMaster.js";

const MainRoutes = {
	path: "",
	element: (
		<>
			<Outlet />
		</>
	),

	children: [
		{
			path: "/",
			element: (
				<>
					<Header />
					<SideNav />
					<Mainpage />
					<Footer />
				</>
			),
		},
		{
			path: "/dashboard",
			element: (
				<>
					<Header />
					<SideNav />
					<Dashboard />
					<Footer />
				</>
			),
		},
		{
			path: "/main",
			element: (
				<>
					<Header />
					<SideNav />
					<Mainpage />
					<Footer />
				</>
			),
		},
		{
			path: "/login",
			element: <Login />,
		},
		{
			path: "/signup",
			element: <Signup />,
		},
		{
            path:"/complete",
            element:(
                <>
                    <Header />
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-1">
                                <SideNav />
                            </div>
                            <div className="col-11">
                            <M1cncProgramMasterComplete/>
                            </div>
                        </div>
                    </div>
                    <Footer />
                </>
            ),
        },
		{
			path: "myprofile",
			element: (
				<>
					<Header />
					<SideNav />
					<Profiles />
					<Footer />
				</>
			),
		},
		{
			path: "Users",
			element: (
				<>
					<Header />
					<SideNav />
					<CreateUser />
					<Footer />
				</>
			),
		},
		{
			path: "createAccessTypes",
			element: (
				<>
					<Header />
					<SideNav />
					<CreateAccessTypes />
					<Footer />
				</>
			),
		},
		{
			path: "createCustomer",
			element: (
				<>
					<Header />
					<SideNav />
					<CreateCustomer />
					<Footer />
				</>
			),
		},
		{
			path: "listcustomer",
			element: (
				<>
					<Header />
					<SideNav />
					<CustomerTable />
					<Footer />
				</>
			),
		},
		{
			path: "createOrder",
			element: (
				<>
					<Header />
					<SideNav />
					<CreateOrder />
					<Footer />
				</>
			),
		},
		{
			path: "orderList",
			element: (
				<>
					<Header />
					<div
						className="container-fluid"
						style={{ marginTop: "105px", width: "100%" }}
					>
						<div className="row">
							<div className="col-1">
								<SideNav />
							</div>
							<div className="col-11">
								<MainTable />
							</div>
						</div>
					</div>
					<Footer />
				</>
			),
		},
		{
			path: "orderHistory",
			element: (
				<>
					<Header />
					<div
						className="container-fluid"
						style={{ marginTop: "105px", width: "100%" }}
					>
						<div className="row">
							<div className="col-1">
								<SideNav />
							</div>
							<div className="col-11">
								<OrderHistory />
							</div>
						</div>
					</div>

					<Footer />
				</>
			),
		},
		{
			path: "lookupentry",
			element: (
				<>
					<Header />
					<SideNav />
					<LookupEntry />
					<Footer />
				</>
			),
		},
		/**Module 1 */
		{
			path: "cncnesting",
			element: (
				<>
					<Header />
					<div className="container-fluid">
						<div className="row">
							<div className="col-1">
								<SideNav />
							</div>
							<div className="col-11">
								<M1cncNesting />
							</div>
						</div>
					</div>

					<Footer />
				</>
			),
		},
		{
			path: "cncpunching",
			element: (
				<>
					<Header />
					<div className="container-fluid">
						<div className="row">
							<div className="col-1">
								<SideNav />
							</div>
							<div className="col-11">
								<M1cncPunching />
							</div>
						</div>
					</div>

					<Footer />
				</>
			),
		},
		{
			path: "epBending",
			element: (
				<>
					<Header />
					<div className="container-fluid">
						<div className="row">
							<div className="col-1">
								<SideNav />
							</div>
							<div className="col-11">
								<M1epBending />
							</div>
						</div>
					</div>

					<Footer />
				</>
			),
		},
		{
			path: "cncpgmmaster",
			element: (
				<>
					<Header />
					<div className="container-fluid">
						<div className="row">
							<div className="col-1">
								<SideNav />
							</div>
							<div className="col-11">
								<M1cncProgramMaster />
							</div>
						</div>
					</div>

					<Footer />
				</>
			),
		},

		/**Module 2 */
		{
			path: "tubecutting",
			element: (
				<>
					<Header />
					<div className="container-fluid">
						<div className="row">
							<div className="col-1">
								<SideNav />
							</div>
							<div className="col-11">
								<M2tubeCutting />
							</div>
						</div>
					</div>

					<Footer />
				</>
			),
		},
		/**Module 3 */
		{
			path: "finpunching",
			element: (
				<>
					<Header />
					<div className="container-fluid">
						<div className="row">
							<div className="col-1">
								<SideNav />
							</div>
							<div className="col-11">
								<M3finsPunching />
							</div>
						</div>
					</div>

					<Footer />
				</>
			),
		},
		{
			path: "coilassembly",
			element: (
				<>
					<Header />
					<div className="container-fluid">
						<div className="row">
							<div className="col-1">
								<SideNav />
							</div>
							<div className="col-11">
								<M3coilAssembly />
							</div>
						</div>
					</div>

					<Footer />
				</>
			),
		},
		{
			path: "coilexpansion",
			element: (
				<>
					<Header />
					<div className="container-fluid">
						<div className="row">
							<div className="col-1">
								<SideNav />
							</div>
							<div className="col-11">
								<M3coilExpansion />
							</div>
						</div>
					</div>

					<Footer />
				</>
			),
		},
		/**Module 4 */
		{
			path: "brazing",
			element: (
				<>
					<Header />
					<div className="container-fluid">
						<div className="row">
							<div className="col-1">
								<SideNav />
							</div>
							<div className="col-11">
								<M4brazingLeak />
							</div>
						</div>
					</div>

					<Footer />
				</>
			),
		},
		{
			path: "paintingpacking",
			element: (
				<>
					<Header />
					<div className="container-fluid">
						<div className="row">
							<div className="col-1">
								<SideNav />
							</div>
							<div className="col-11">
								<M4paintPacking />
							</div>
						</div>
					</div>

					<Footer />
				</>
			),
		},
		/**diapatch & finished */
		{
			path: "dispatch",
			element: (
				<>
					<Header />
					<div className="container-fluid">
						<div className="row">
							<div className="col-1">
								<SideNav />
							</div>
							<div className="col-11">
								<Dispatch />
							</div>
						</div>
					</div>

					<Footer />
				</>
			),
		},
		{
			path: "finishedstock",
			element: (
				<>
					<Header />
					<div className="container-fluid">
						<div className="row">
							<div className="col-1">
								<SideNav />
							</div>
							<div className="col-11">
								<FinishedStock />
							</div>
						</div>
					</div>

					<Footer />
				</>
			),
		},
		{
			path: "scheduler",
			element: (
				<>
					<Header />
					<div className="container-fluid">
						<div className="row">
							<div className="col-1">
								<SideNav />
							</div>
							<div className="col-11">
								<Scheduler />
							</div>
						</div>
					</div>
					<Footer />
				</>
			),
		},
		{
			path: "moduleAccess",
			element: (
				<>
					<Header />
					<div className="container-fluid">
						<div className="row">
							<div className="col-1">
								<SideNav />
							</div>
							<div className="col-11">
								<ModuleAccess />
							</div>
						</div>
					</div>
					<Footer />
				</>
			),
		},
		{
			path: "wip_ep",
			element: (
				<>
					<Header />
					<div className="container-fluid">
						<div className="row">
							<div className="col-1">
								<SideNav />
							</div>
							<div className="col-11">
								<WIP_EP />
							</div>
						</div>
					</div>
					<Footer />
				</>
			),
		},
		{
			path: "wip_pipe",
			element: (
				<>
					<Header />
					<div className="container-fluid">
						<div className="row">
							<div className="col-1">
								<SideNav />
							</div>
							<div className="col-11">
								<WIP_Pipe />
							</div>
						</div>
					</div>
					<Footer />
				</>
			),
		},
		{
			path: "wip_fins",
			element: (
				<>
					<Header />
					<div className="container-fluid">
						<div className="row">
							<div className="col-1">
								<SideNav />
							</div>
							<div className="col-11">
								<WIP_Fins />
							</div>
						</div>
					</div>
					<Footer />
				</>
			),
		},
		{
			path: "cnc_program_master",
			element: (
				<>
					<Header />
					<div className="container-fluid">
						<div className="row">
							<div className="col-1">
								<SideNav />
							</div>
							<div className="col-11">
								<CNCProgramMaster />
							</div>
						</div>
					</div>
					<Footer />
				</>
			),
		},
	],
};
export default MainRoutes;
