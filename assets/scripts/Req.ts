import { _decorator, Component, Node, view, log } from 'cc';
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

    _cbiRg: Node[] = [];
    _holdRg: Node[] = [];
    _itemRg: Node[] = [];

    _oneCbi: Node[] = [];
    _otherCbi: Node[] = [];

    _woodNode: Node = null;

    _countHoldCbiLast: Node = null;
    _countHold: any = 0;

    _flag: boolean = false;

    _piece: number = 0;

    _nodesToHandle1: Node[] = [];
}

