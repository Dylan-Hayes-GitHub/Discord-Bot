export default class Role {
    missionType: string;
    roleId: string;
    
    constructor(missionType, roleId){
        this.missionType = missionType;
        this.roleId = roleId;
    }

    getMissionType() {
        return this.missionType;
    }

    getRoleId() {
        return this.roleId;
    }
}