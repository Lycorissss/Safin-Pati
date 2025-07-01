'use client';

import { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import {
    FaTachometerAlt,
    FaLeaf,
    FaUser,
    FaClipboardList,
    FaCheckCircle,
    FaClipboardCheck,
    FaChartLine,
    FaBoxes,
    FaCaretDown,
    FaCaretUp,
} from 'react-icons/fa';

const mainMenuItems = [
    { icon: <FaTachometerAlt />, label: 'Dashboard' },
    { icon: <FaLeaf />, label: 'Master Planting' },
    { icon: <FaBoxes />, label: 'Clusters' },
    { icon: <FaUser />, label: 'Data Master User' },
    { icon: <FaChartLine />, label: 'Stage Activity' },
    { icon: <FaCheckCircle />, label: 'Verification' },
];

const plantingSubItems = [
    { icon: <FaClipboardCheck />, label: 'Planting Stage Monitorings' },
    { icon: <FaClipboardList />, label: 'Planting Stage Reports' },
    { icon: <FaClipboardCheck />, label: 'Planting Stage Verifications' },
];

export default function SideBar() {
    const sidebarRef = useRef<HTMLDivElement>(null);
    const labelsRef = useRef<(HTMLSpanElement | null)[]>([]);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [isPlantingOpen, setIsPlantingOpen] = useState(false);

    useEffect(() => setIsClient(true), []);

    useEffect(() => {
        if (!isClient) return;

        if (isExpanded) {
            gsap.to(sidebarRef.current, {
                width: 220,
                duration: 0.3,
                ease: 'power2.out',
            });

            gsap.to(labelsRef.current, {
                opacity: 1,
                display: 'inline',
                stagger: 0.05,
                duration: 0.2,
                delay: 0.1,
            });
        } else {
            setIsPlantingOpen(false); // auto-collapse if sidebar closed
            gsap.to(sidebarRef.current, {
                width: 60,
                duration: 0.3,
                ease: 'power2.inOut',
            });

            gsap.to(labelsRef.current, {
                opacity: 0,
                display: 'none',
                duration: 0.1,
                stagger: {
                    each: 0.03,
                    from: 'end',
                },
            });
        }
    }, [isExpanded, isClient]);

    const renderMenu = (items: typeof mainMenuItems, startIndex = 0) =>
        items.map((item, i) => (
            <div
                key={startIndex + i}
                className="flex items-center gap-3 px-2 py-2 hover:bg-green-200 rounded-md text-gray-700 cursor-pointer"
            >
                <span className="text-xl w-[24px] flex justify-center">{item.icon}</span>
                <span
                    ref={(el) => { labelsRef.current[startIndex + i] = el }}
                    className="text-sm opacity-0 whitespace-normal break-words"
                    style={{ display: 'none' }}
                >
                    {item.label}
                </span>
            </div>
        ));

    return (
        <div
            ref={sidebarRef}
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
            className="bg-[#fdfcf9] h-screen w-[60px] overflow-hidden shadow-lg flex flex-col gap-4 transition-all duration-300"
        >
            <div className="flex items-center justify-center h-[80px] border-b">
                <img src="/pena-logo.png" alt="PENA Logo" className="h-10 w-auto" />
            </div>

            <nav className="flex flex-col gap-2 px-2">
                {renderMenu(mainMenuItems, 0)}

                {/* Dropdown parent */}
                <div
                    onClick={() => isExpanded && setIsPlantingOpen((prev) => !prev)}
                    className="flex items-center gap-3 px-2 py-2 hover:bg-green-200 rounded-md text-gray-700 cursor-pointer"
                >
                    <span className="text-xl w-[24px] flex justify-center">
                        <FaClipboardCheck />
                    </span>
                    <span
                        ref={(el) => { labelsRef.current[mainMenuItems.length] = el }}
                        className="flex justify-between items-center w-full text-sm opacity-0 whitespace-nowrap"
                        style={{ display: 'none' }}
                    >
                        <div className='w-full flex'>
                            Planting Stage
                            <span className="ml-auto pr-2">
                                {isPlantingOpen ? <FaCaretUp /> : <FaCaretDown />}
                            </span>
                        </div>
                    </span>
                </div>

                {/* Dropdown children */}
                {isExpanded && isPlantingOpen && (
                    <div className="pl-10 flex flex-col gap-1">
                        {plantingSubItems.map((item, idx) => (
                            <div
                                key={idx}
                                className="flex items-center gap-2 px-2 py-1 hover:bg-green-100 rounded-md text-gray-700 cursor-pointer text-sm"
                            >
                                <span className="text-base">{item.icon}</span>
                                <span className="break-words leading-tight">{item.label}</span>
                            </div>
                        ))}
                    </div>
                )}
            </nav>
        </div>
    );
}
