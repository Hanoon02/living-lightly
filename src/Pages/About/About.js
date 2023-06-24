import React from "react";
import {Link} from "react-router-dom";
import {ABOUT_SHOP_IMG, ABOUT_ROUTE_IMG, ABOUT_FOREST_IMG, ABOUT_PATCH_IMG} from "../../Constants/constants";

export default function About() {
    return (
        <>
            <div className={"bg-[#D0BA89] bg-[url('../public/Assets/Images/map_overlay.png')] bg-contain bg-no-repeat bg-center gotu-font w-full"}>
                <div className={'px-[50px] py-[50px]'}>
                    <div className={"bg-center bg-cover bg-[url('../public/Assets/Images/inset_map_overlay.png')] flex align-top justify-evenly"}>
                        <div className={'grid content-start order border-3 border-black flex  flex-col w-1/2 align-center justify-center'}>
                            <div className={'flex h-[800px]'}>
                                <div className={'grid content-end w-1/3border border-3 border-black'}>
                                    <img src={ABOUT_SHOP_IMG} alt={'shop'} className={''} />
                                </div>
                                <div className={'grid brder border-3 order-black content-start w-2/3 z-50 brder border-3 border-black flex '}>
                                    <p className={'text-[39px] text-center text-[#894E35]'}>About Us</p>
                                    <div className={"bg-center bg-cover bg-[url('../public/Assets/Images/About/brown.png')]"}>
                                        <p className={'text-[20px] pl-10 py-10'}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={'w-1/2 flex flex-col align-center justify-center cursor-pointer'}>
                            <button className={'rounded-full px-[100px] mx-auto py-2 text-[24px] bg-[#D0BA89]'}>
                                <Link to={'/base'}>Explore</Link>
                            </button>
                            <div className={'brder border-3 border-black h-[500px]'}>
                                <div className={'absolute'}>
                                    <p className={'text-[#894E35] text-[24px] pt-[200px] pl-5 underline'}>
                                        Chakrata Sankri Route
                                    </p>
                                    <p className={'text-[#894E35] text-[24px] pt-[30px] pl-[400px] underline'}>
                                        Chakrata Sankri Route
                                    </p>
                                    <p className={'text-[#894E35] text-[24px] pt-[100px] pl-[200px] underline'}>
                                        Chakrata Sankri Route
                                    </p>
                                </div>
                                <div className={'absolute boder border-3 border-black '}>
                                    <img src={ABOUT_PATCH_IMG} alt={'patch'} />
                                </div>
                                <img src={ABOUT_ROUTE_IMG} alt={'route'} className={''} />
                            </div>
                            <div>
                                <div className={'flex pt-5 pl-5'}>
                                    <img src={ABOUT_FOREST_IMG} alt={'forest'} className={''} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}