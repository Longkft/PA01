import { _decorator, Component, Node, Input, log, tween, Vec3, UITransform, RigidBody2D, PolygonCollider2D, ERigidBody2DType, HingeJoint2D } from 'cc';
import { Req } from './Req';
import { Wood } from './Wood';
const { ccclass, property } = _decorator;

@ccclass('Hold')
export class Hold extends Component {

    start() {
        this.registerTouch();
    }

    update(deltaTime: number) {

    }

    registerTouch() {
        this.node.on(Input.EventType.TOUCH_START, this.touchStart, this);
    }

    destroyTouch() {
        this.node.off(Input.EventType.TOUCH_START, this.touchStart, this);
    }

    checkInputCbi() {

    }

    touchStart() {
        if (Req.instance._woodNode) {
            log('touchStart-hold')

            const woodNode = Req.instance._woodNode;
            let posThisNode = this.node.position;

            woodNode.getComponent(PolygonCollider2D).group = 8;

            tween(Req.instance._woodNode).tag(2)
                .to(0.3, { position: new Vec3(posThisNode.x, posThisNode.y + 45, posThisNode.z) })
                .call(() => {
                    const woodNodeComponent = woodNode.getComponent(Wood);
                    woodNode.getComponent(PolygonCollider2D).group = 2;
                    woodNodeComponent.playAni(woodNode, 1);
                    woodNodeComponent.tweenWood(woodNode, -45);
                    woodNodeComponent.xuoi = false;
                    Req.instance._woodNode = null;


                    this.checkRigid();
                })
                .start();

        }
    }

    checkRigid() {
        let listItem = Req.instance._item;

        listItem.forEach((element, index) => {
            let listChild = element.children;

            let countHold = 0;
            listChild.forEach((ele, i) => {
                let name = ele.name;
                let filName = name.replace(/[0-9-]/g, '');

                if (filName === 'hold') {
                    countHold++;
                }
            });

            listChild.forEach((ele, i) => {
                let name = ele.name;
                let filName = name.replace(/[0-9-]/g, '');

                if (filName === 'hold') {
                    if (countHold === 1) {
                        if (!this.isNodeCovered(ele)) {
                            // ele.parent.getComponent(PolygonCollider2D).group = 16;
                            ele.parent.getComponent(RigidBody2D).type = ERigidBody2DType.Dynamic;  // Thiết lập loại RigidBody
                        }
                    } else if (countHold > 1) {
                        const eParent = ele.parent
                        const eleHinge = eParent.getComponent(HingeJoint2D);
                        let arrayCbi = Req.instance._cbi;
                        if (!eleHinge) {
                            eParent.addComponent(HingeJoint2D);
                        }

                        let counCbi = 0;
                        let nodeCbi: Node = null;
                        // arrayCbi.forEach((eCbi, j) => {
                        //     if (this.isOverlappingNoneposition(eParent, eCbi)) {
                        //         counCbi++;
                        //         nodeCbi = eCbi;
                        //     }
                        // });

                        // log('counCbi: ', counCbi)
                        // log('nodeCbi: ', nodeCbi)

                        // if (counCbi === 1) {
                        //     log(1)
                        //     if (nodeCbi) {
                        //         log(2)
                        //         eParent.getComponent(HingeJoint2D).connectedBody = nodeCbi.getComponent(RigidBody2D);
                        //     }
                        // } else if (counCbi === 0) {
                        //     log(3)
                        //     eParent.getComponent(HingeJoint2D).connectedBody = null;
                        //     eParent.getComponent(RigidBody2D).type = ERigidBody2DType.Dynamic;
                        // }

                        let countHold1 = 0;
                        listChild.forEach((ele1, inx) => {
                            let name = ele.name;
                            let filName = name.replace(/[0-9-]/g, '');

                            log('a')
                            if (filName === 'hold') {
                                log('b')
                                countHold1++;
                            }
                        });
                        log('countHold1: ', countHold1)

                        if (countHold1 === 1) {
                            log(1)
                            if (nodeCbi) {
                                log(2)
                                eParent.getComponent(HingeJoint2D).connectedBody = nodeCbi.getComponent(RigidBody2D);
                            }
                        } else if (countHold1 === 0) {
                            log(3)
                            eParent.getComponent(HingeJoint2D).connectedBody = null;
                            eParent.getComponent(RigidBody2D).type = ERigidBody2DType.Dynamic;
                        }
                    }
                }
            })
        });
    }

    isNodeCovered(node: Node): boolean {
        let listHold = Req.instance._hold;
        let listCbi = Req.instance._cbi;
        let isCovered = false;
        let isCoveredOnce = false;

        for (const upperNode of listHold) {
            if (this.isOverlapping(node, upperNode)) {
                isCoveredOnce = true;
                continue;
            }
        }

        if (isCoveredOnce) {
            for (const middleNode of listCbi) {
                if (this.isOverlapping(node, middleNode)) {
                    isCovered = true;
                    continue;
                }
            }
        }
        return isCovered;
    }

    // Hàm so sánh xấp xỉ cho Vec3
    approximatelyEqual(v1: Vec3, v2: Vec3, epsilon: number = 1): boolean {
        return Math.abs(v1.x - v2.x) < epsilon &&
            Math.abs(v1.y - v2.y) < epsilon &&
            Math.abs(v1.z - v2.z) < epsilon;
    }

    isOverlapping(node1: Node, node2: Node): boolean {
        const rect1 = node1.getComponent(UITransform).getBoundingBoxToWorld();
        const rect2 = node2.getComponent(UITransform).getBoundingBoxToWorld();

        if (rect1.intersects(rect2)) {
            const pos1World = node1.getParent().getComponent(UITransform).convertToWorldSpaceAR(node1.position);
            const pos2World = node2.getParent().getComponent(UITransform).convertToWorldSpaceAR(node2.position);

            if (this.approximatelyEqual(pos1World, pos2World)) {
                return true;
            }
        }
        return false;
    }

    isNodeCoveredNonePosition(node: Node): boolean {
        let listHold = Req.instance._hold;
        let listCbi = Req.instance._cbi;
        let isCovered = false;
        let isCoveredOnce = false;

        for (const upperNode of listHold) {
            if (this.isOverlappingNoneposition(node, upperNode)) {
                isCoveredOnce = true;
                continue;
            }
        }

        if (isCoveredOnce) {
            for (const middleNode of listCbi) {
                if (this.isOverlappingNoneposition(node, middleNode)) {
                    isCovered = true;
                    continue;
                }
            }
        }
        return isCovered;
    }

    isOverlappingNoneposition(node1: Node, node2: Node) {
        const rect1 = node1.getComponent(UITransform).getBoundingBoxToWorld();
        const rect2 = node2.getComponent(UITransform).getBoundingBoxToWorld();
        return rect1.intersects(rect2);
    }
}

