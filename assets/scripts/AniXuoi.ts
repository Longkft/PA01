import { _decorator, Component, Node, AnimationClip, find, log } from 'cc';
import { Req } from './Req';
const { ccclass, property } = _decorator;

@ccclass('AniXuoi')
export class AniXuoi extends Component {
    @property(AnimationClip)
    public cbiNguoc: AnimationClip = null;
    @property(AnimationClip)
    public cbiXuoi: AnimationClip = null;

    start() {
        // Play the default animation
        // this.animationComponent.play('defaultAnimation');
        this.loadData();
    }

    playAnimation(animationName: string) {
        // this.animationComponent.play(animationName);
    }

    stopAnimation(animationName: string) {
        // this.animationComponent.stop(animationName);
    }

    loadData() {

        let array = [];
        let array1 = [];
        let array2 = [];
        const game = find("Canvas/Game").children;

        game.forEach((element, index) => {
            let name = element.name;
            let filName = name.replace(/[0-9-]/g, '');
            if (filName === 'cbi') {
                array.push(element);
            } else if (filName === 'hold') {
                array1.push(element);
            } else {
                if (filName !== 'line' && filName !== 'thanhgo') {
                    array2.push(element);
                }
            }
        });

        Req.instance._cbi = array;
        Req.instance._hold = array1;
        Req.instance._item = array2;
    }
}

