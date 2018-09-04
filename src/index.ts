import Tms from './tms';

export default Tms;

interface Response {
    code: number;
    data: string [];
}

class Api {
    getList(): Promise<Response> {
        return new Promise((resolve) => {
            resolve({
                code: 0,
                data: ['1', '2']
            });
        });
    }
}

class List extends Tms {
    api: Api;
    loading: boolean = false
    data: string[] = [];
    constructor(api: Api) {
        super();
        this.api = api;
    }
    $loadStart() {
        this.loading = true;
    }
    $loadDone(response: Response) {
        if (response.code === 0) {
            this.data = response.data;
        }
        this.loading = false;
    }
    async getList() {
        this.$loadStart();
        this.$loadDone(await this.api.getList());
    }
}

const list = new List(new Api());

list.getList();