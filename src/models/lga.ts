import { Model } from "objection";
import PollingUnit from "./PollingUnit";

class Lga extends Model {
    static tableName = 'lga';

    static relationMappings = {
        polling_unit: {
            relation: Model.HasManyRelation,
            modelClass: PollingUnit,
            join: {
                from: 'lga.lga_id',
                to: 'polling_unit.lga_id',
            },
        }
    }
}

export default Lga;