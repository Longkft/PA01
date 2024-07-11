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

    _countHoldCbiLast: Node = null; // đếm còn bao nhiêu
    _nodePrLast: Node = null; // lấy node của cha

    _countHold: any = 0;

    _flag: boolean = false;

    _piece: number = 0;

    _nodesToHandle1: Node[] = [];

    _nodeInfo: { node: Node; countHold: number; nodeLastCbi: Node; nodeLast: Node }[] = [];
    _nodeInfo1: { node: Node; dinh: Node }[] = [];

    _endGame: boolean = false;
}

