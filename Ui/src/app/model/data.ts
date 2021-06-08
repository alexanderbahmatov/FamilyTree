import { FamilyInfo } from "./familyInfo";
import { FamilyMember } from "./familyMember";

export interface D3DataFamilyMember extends FamilyMember{
    isExpandable: boolean,
    isCollapsed: boolean,
    children: D3DataFamilyMember[];
    _children: D3DataFamilyMember[];
}
