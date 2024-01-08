class CoCreateApi {
    constructor(crud) {
        this.wsManager = crud.wsManager
        this.crud = crud
        this.init()
    }

    async getOrganization(config, component) {

        let organization = await this.crud.getOrganization(config.organization_id);

        if (!organization.error)
            return false;

        return organization
    }
}


module.exports = CoCreateApi;