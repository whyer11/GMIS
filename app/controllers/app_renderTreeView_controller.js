/**
 * Created by whyer on 14-4-3.
 */
var EventProxy = require('eventproxy');
var ep = new EventProxy();
module.exports = function (req, res) {
    var appid = req.body.appid;
    var models = {
        gom_appclses: req.models.gom_appclses,
        gom_insts: req.models.gom_insts,
        gom_refs: req.models.gom_refs,
        gom_apps: req.models.gom_apps,
        gom_clses:req.models.gom_clses
    };

    models.gom_refs.find(['REF_ID', 'A'], function (err, refcols) {
        ep.emit('returnallrefs', refcols);
    });

    models.gom_apps.get(appid, function (err, app) {
        ep.emit('returnpid', app.REF_ID);
    });

    ep.all('returnallrefs', 'returnpid', function (refs, pid) {

        var tree = [];
        //console.log(refs);
        for (var i = 0; i < refs.length; i++) {
            isChild(pid, refs[i], refs[i], refs, tree);
        }
        ep.emit('returntree', tree);
    });

    ep.all('returntree', function (tree) {

        addProperties(0, tree);
    });

    ep.all('propertyall', function (tree) {
        //console.log(tree);
        var newTree = [];
        var index = 0;
        models.gom_appclses.find({APP_ID:appid}, function (err, appclses) {
            if(err){
                /**
                 *
                 */
            }else{
                for(var i =0;i<appclses.length;i++){
                    for(var j = 0;j<tree.length;j++){
                        if(tree[j].REF_CLS_ID == appclses[i].CLS_ID){
                            newTree[index] = tree[j];
                            index++;
                        }
                    }
                }
                req.db.driver.close();
                return res.send(200,newTree);
            }
        });


    });

    /**
     *
     * @param pid
     * @param c_obj
     * @param next
     * @param ref_array
     * @param tree_array
     */
    function isChild(pid, c_obj, next, ref_array, tree_array) {
        if (pid == next.REF_ID) {
            tree_array.push(c_obj);
        } else {
            for (var i = 0; i < ref_array.length; i++) {
                if (ref_array[i].REF_ID == next.PARENT_REF_ID) {
                    isChild(pid, c_obj, ref_array[i], ref_array, tree_array);
                }
            }
        }
    }

    /**
     *
     * @param i
     * @param tree
     */
    function addProperties(i, tree) {
        if (i < tree.length) {
            models.gom_insts.get(tree[i].INST_ID, function (err, inst) {
                models.gom_clses.get(inst.CLS_ID, function (err,cls) {


                    tree[i].REF_CLS_NAME = cls.CLS_NAME;
                    tree[i].REF_NAME = inst.INST_NAME;
                    tree[i].REF_CLS_ID = inst.CLS_ID;
                    tree[i].REF_INST_ID = inst.INST_ID;
                    tree[i].REF_APP_ID = appid;
                    i++;
                    return addProperties(i, tree);
                })
            })
        } else {
            ep.emit('propertyall', tree);
        }
    }
};