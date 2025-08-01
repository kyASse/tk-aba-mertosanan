"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"
import Link from "next/link"

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"

export function NavMain({
    items,
}: {
    items: {
        title: string
        url: string
        icon?: LucideIcon
        isActive?: boolean
        items?: {
        title: string
        url: string
        }[]
    }[]
    }) {
    return (
        <SidebarGroup>
        <SidebarGroupLabel>Menu Admin</SidebarGroupLabel>
        <SidebarMenu>
            {items.map((item) => (
            <Collapsible
                key={item.title}
                asChild
                defaultOpen={item.isActive}
                className="group/collapsible"
            >
                <SidebarMenuItem>
                {item.items ? (
                    <>
                    <CollapsibleTrigger asChild>
                        <SidebarMenuButton tooltip={item.title}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <SidebarMenuSub>
                        {item.items?.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton asChild>
                                    <Link href={subItem.url}>
                                    <span>{subItem.title}</span>
                                    </Link>
                                </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                        ))}
                        </SidebarMenuSub>
                    </CollapsibleContent>
                    </>
                ) : (
                    <SidebarMenuButton tooltip={item.title} asChild>
                        <Link href={item.url}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        </Link>
                    </SidebarMenuButton>
                )}
                </SidebarMenuItem>
            </Collapsible>
            ))}
        </SidebarMenu>
        </SidebarGroup>
    )
}
