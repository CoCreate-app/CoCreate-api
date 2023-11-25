class CoCreateApi {
    constructor(crud) {
        this.wsManager = crud.wsManager
        this.crud = crud
        this.init()
    }

    async getOrganization(config, component) {

        let org = await CRUD.send({
            method: 'object.read',
            array: "organizations",
            key: config["key"],
            organization_id: config["organization_id"],
            object: {
                _id: config["organization_id"]
            }

        });

        if (!org || !org.object && !org.object[0]) {
            console.log(component, " Error GET ORG  in : ", e);
            return false;
        }

        return org.object[0];
    }

    async getApiKey(organization_id, name) {
        this.organizations[organization_id] = this.getOrganization(organization_id, name)
        this.organizations[organization_id] = await this.organizations[organization_id]
        return this.organizations[organization_id]
    }

    async getOrganizationNew(organization_id, name) {
        let organization = await this.crud.send({
            method: 'object.read',
            database: organization_id,
            array: 'organizations',
            object: [{ _id: organization_id }],
            organization_id
        })

        if (organization
            && organization.object
            && organization.object[0]) {
            if (organization.object[0].apis && organization.object[0].apis[name]) {
                return organization.object[0].apis && organization.object[0].apis[name]
            } else
                return { [this.name]: false, error: 'An apikey could not be found' }
        } else {
            return { serverOrganization: false, error: 'An organization could not be found' }
        }

    }

}


module.exports = CoCreateApi;