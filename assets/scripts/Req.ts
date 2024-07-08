import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Req')
export class Req extends Component {

    private static _instance: any = null;

    static getInstance<T>(): T {
        if (this._instance === null) {
            this._instance = new this()
        }
        return this._instance
    }

    static get instance() {
        return this.getInstance<Req>()
    }

    _cbi: Node[] = [];
    _hold: Node[] = [];
    _item: Node[] = [];

    _oneCbi: Node[] = [];
    _otherCbi: Node[] = [];

    _woodNode: Node = null;
}

