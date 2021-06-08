import { Injectable } from "@angular/core";
import { D3DataFamilyMember } from "../model/data";
import { FamilyInfo } from "../model/familyInfo";
import { FamilyMember } from "../model/familyMember";

@Injectable()
export class DataAdapter {
    public ConvertFamilyInfo(familyInfo: FamilyInfo): void {
        familyInfo.members?.forEach(member => this.ConcatParentsAndChilds);
    }
    public ConcatParentsAndChilds(familyMember: FamilyMember): D3DataFamilyMember {
        var result = familyMember as D3DataFamilyMember;
        result.isCollapsed = true;
        result._children = (familyMember.childs as D3DataFamilyMember[]).concat(familyMember.parents as D3DataFamilyMember[]);
        result.isExpandable = result._children ? true : false;
        return result;
    }
}
