import type { NextPage } from 'next'
import PageWithStore from 'site-specific/components/PageWithStore';

const Product: NextPage = () => {
    return (<>
        <div className="mt-20">
            <div className="bg-cover bg-center absolute z-0 h-screen bg-no-repeat" style={{}} />
            <div className="z-0 opacity-90 w-full h-full absolute" style={{ "background": "linear-gradient(-45deg, #2f1ce0 0%, #53a0fd 50%, #51eca5 100%)" }} />
            <div className="absolute w-full flex flex-col">
                <div className="bg-white pb-8 w-full pt-8">
                    <div className="container mx-auto">
                        <form className="flex xl:hidden p-2 w-full justify-center pb-16">
                            <input className="rounded-l-full p-2 border-t mr-0 border-b border-l text-gray-800 border-gray-200 bg-white" placeholder="your@mail.com" />
                            <button className="px-2 rounded-r-full bg-yellow-400 text-gray-800 font-bold p-4 uppercase border-yellow-500 border-t border-b border-r">Subscribe</button>
                        </form>
                        <div className="text-center w-full pb-16">
                            <h3 className="uppercase text-gray-800">Why choose my app?</h3>
                            <p className="sm:text-3xl text-2xl text-black-800 pt-4 xl:w-1/2 mx-auto">
                                A simple, proven way to boost your team perfomance.
                            </p>
                        </div>
                        <div className="flex sm:flex-row flex-col w-full xl:mt-12 mb-12 xl:px-0 px-4">
                            <div className="sm:w-1/3 mb-8 sm:mb-0 xl:pr-0 pr-2">
                                <div className="flex flex-wrap mb-4">
                                    <div className="w-1/6 items-center mx-auto">
                                        <svg height="40px" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 58.201 58.201" style={{ "enable-background": "new 0 0 58.201 58.201" }} xmlSpace="preserve">
                                            <path d="M31.707,33.07c-0.87,0.027-1.74,0.042-2.606,0.042c-0.869,0-1.742-0.014-2.614-0.042 c-7.341-0.201-13.191-1.238-17.403-2.717C7.104,29.685,5.409,28.899,4.1,28v7.111v0.5v0.5V37.4c2.846,2.971,12.394,5.711,25,5.711                             s22.154-2.74,25-5.711v-1.289v-0.5v-0.5V28c-1.318,0.905-3.028,1.697-5.025,2.367C44.865,31.839,39.027,32.87,31.707,33.07z" />
                                            <path d="M4.1,14.889V22v0.5V23v1.289c2.638,2.754,11.033,5.31,22.286,5.668c0.115,0.004,0.233,0.005,0.349,0.008 c0.326,0.009,0.651,0.018,0.982,0.023C28.174,29.996,28.635,30,29.1,30s0.926-0.004,1.383-0.011                             c0.33-0.005,0.656-0.014,0.982-0.023c0.116-0.003,0.234-0.005,0.349-0.008c11.253-0.359,19.648-2.915,22.286-5.668V23v-0.5V22                             v-7.111C49.233,18.232,38.944,20,29.1,20S8.968,18.232,4.1,14.889z" />                             <path d="M53.965,8.542C52.843,4.241,44.215,0,29.1,0C14.023,0,5.404,4.22,4.247,8.51C4.162,8.657,4.1,8.818,4.1,9v0.5v1.806 C6.937,14.267,16.417,17,29.1,17s22.164-2.733,25-5.694V9.5V9C54.1,8.832,54.044,8.681,53.965,8.542z" />
                                            <path d="M4.1,41v8.201c0,0.162,0.043,0.315,0.117,0.451c1.181,4.895,11.747,8.549,24.883,8.549c13.106,0,23.655-3.639,24.875-8.516 c0.08-0.144,0.125-0.309,0.125-0.484v-8.199c-4.135,2.911-12.655,5.199-25,5.199C16.754,46.201,8.234,43.911,4.1,41z" />
                                        </svg>
                                    </div>
                                    <div className="w-5/6"><h4 className="text-black items-center xl:text-2xl">One Platform</h4></div>
                                </div>
                                <p><b className="font-normal text-blue-600">No more Mulitple Platforms.</b> Now it had see nunable uneasy. Drawings can followed by improved out sociable not. Earnestly so do instantly pretended.</p>
                            </div>
                            <div className="sm:w-1/3 mb-8 sm:mb-0 xl:pr-0 pr-2">
                                <div className="flex flex-wrap mb-4">
                                    <div className="w-1/6 items-center mx-auto">
                                        <svg height="40px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 55 55" style={{ "enable-background": "new 0 0 55 55" }} xmlSpace="preserve">
                                            <path d="M55,27.5C55,12.337,42.663,0,27.5,0S0,12.337,0,27.5c0,8.009,3.444,15.228,8.926,20.258l-0.026,0.023l0.892,0.752 c0.058,0.049,0.121,0.089,0.179,0.137c0.474,0.393,0.965,0.766,1.465,1.127c0.162,0.117,0.324,0.234,0.489,0.348 c0.534,0.368,1.082,0.717,1.642,1.048c0.122,0.072,0.245,0.142,0.368,0.212c0.613,0.349,1.239,0.678,1.88,0.98 c0.047,0.022,0.095,0.042,0.142,0.064c2.089,0.971,4.319,1.684,6.651,2.105c0.061,0.011,0.122,0.022,0.184,0.033 c0.724,0.125,1.456,0.225,2.197,0.292c0.09,0.008,0.18,0.013,0.271,0.021C25.998,54.961,26.744,55,27.5,55 c0.749,0,1.488-0.039,2.222-0.098c0.093-0.008,0.186-0.013,0.279-0.021c0.735-0.067,1.461-0.164,2.178-0.287 c0.062-0.011,0.125-0.022,0.187-0.034c2.297-0.412,4.495-1.109,6.557-2.055c0.076-0.035,0.153-0.068,0.229-0.104 c0.617-0.29,1.22-0.603,1.811-0.936c0.147-0.083,0.293-0.167,0.439-0.253c0.538-0.317,1.067-0.648,1.581-1 c0.185-0.126,0.366-0.259,0.549-0.391c0.439-0.316,0.87-0.642,1.289-0.983c0.093-0.075,0.193-0.14,0.284-0.217l0.915-0.764 l-0.027-0.023C51.523,42.802,55,35.55,55,27.5z M2,27.5C2,13.439,13.439,2,27.5,2S53,13.439,53,27.5 c0,7.577-3.325,14.389-8.589,19.063c-0.294-0.203-0.59-0.385-0.893-0.537l-8.467-4.233c-0.76-0.38-1.232-1.144-1.232-1.993v-2.957 c0.196-0.242,0.403-0.516,0.617-0.817c1.096-1.548,1.975-3.27,2.616-5.123c1.267-0.602,2.085-1.864,2.085-3.289v-3.545 c0-0.867-0.318-1.708-0.887-2.369v-4.667c0.052-0.52,0.236-3.448-1.883-5.864C34.524,9.065,31.541,8,27.5,8 s-7.024,1.065-8.867,3.168c-2.119,2.416-1.935,5.346-1.883,5.864v4.667c-0.568,0.661-0.887,1.502-0.887,2.369v3.545 c0,1.101,0.494,2.128,1.34,2.821c0.81,3.173,2.477,5.575,3.093,6.389v2.894c0,0.816-0.445,1.566-1.162,1.958l-7.907,4.313 c-0.252,0.137-0.502,0.297-0.752,0.476C5.276,41.792,2,35.022,2,27.5z" />
                                        </svg>
                                    </div>
                                    <div className="w-4/5"><h4 className="text-black items-center xl:text-2xl">Communication</h4></div>
                                </div>
                                <p><b className="font-normal text-blue-600">No more Mulitple Platforms.</b> Now it had see nunable uneasy. Drawings can followed by improved out sociable not. Earnestly so do instantly pretended.</p>
                            </div>
                            <div className="sm:w-1/3 mb-8 sm:mb-0 xl:pr-0 pr-2">
                                <div className="flex flex-wrap mb-4">
                                    <div className="w-1/6 items-center mx-auto">
                                        <svg height="40px" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 58.201 58.201" style={{ "enable-background": "new 0 0 58.201 58.201" }} xmlSpace="preserve">
                                            <path d="M42.117,43.007c-0.55-0.067-1.046,0.327-1.11,0.876s0.328,1.046,0.876,1.11C52.399,46.231,58,49.567,58,51.5 c0,2.714-10.652,6.5-28,6.5S2,54.214,2,51.5c0-1.933,5.601-5.269,16.117-6.507c0.548-0.064,0.94-0.562,0.876-1.11 c-0.065-0.549-0.561-0.945-1.11-0.876C7.354,44.247,0,47.739,0,51.5C0,55.724,10.305,60,30,60s30-4.276,30-8.5 C60,47.739,52.646,44.247,42.117,43.007z" />
                                            <path d="M29.823,54.757L45.164,32.6c5.754-7.671,4.922-20.28-1.781-26.982C39.761,1.995,34.945,0,29.823,0 s-9.938,1.995-13.56,5.617c-6.703,6.702-7.535,19.311-1.804,26.952L29.823,54.757z M30,12c3.86,0,7,3.141,7,7s-3.14,7-7,7 s-7-3.141-7-7S26.14,12,30,12z" />
                                        </svg>
                                    </div>
                                    <div className="w-4/5"><h4 className="text-black items-center xl:text-2xl">Project Management</h4></div>
                                </div>
                                <p><b className="font-normal text-blue-600">No more Mulitple Platforms.</b> Now it had see nunable uneasy. Drawings can followed by improved out sociable not. Earnestly so do instantly pretended.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <footer className="container text-center pb-8 border-t border-gray-200 pt-8 text-xs text-gray-700">
                    <div>Template inspired in: <a className="text-orange-600" href="http://preview.uxtheme.website/xpider-preview/xpider/home-adelaide.html">xPider theme</a></div>
                </footer>
            </div>
        </div>
    </>);
}

export default PageWithStore(Product)
