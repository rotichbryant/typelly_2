import { isEmpty } from 'lodash';

const {
    DB_CONNECTION,
    DB_HOST,
    DB_PORT,
    DB_DATABASE,
    DB_USERNAME,
    DB_PASSWORD,
    DB_SYNC,
} = process.env

export default () => ({
    // connection: !isEmpty(DB_CONNECTION) ? DB_CONNECTION : 'mysql',
    host:       !isEmpty(DB_HOST) ? DB_HOST : '127.0.0.1',
    port:       !isEmpty(DB_PORT) ? parseInt(DB_PORT) : 3306,
    databae:    !isEmpty(DB_DATABASE) ? DB_DATABASE : '',
    username:   !isEmpty(DB_USERNAME) ? DB_USERNAME : 'root',
    password:   !isEmpty(DB_PASSWORD) ? DB_PASSWORD : '',
    // sync:       !isEmpty(DB_SYNC) ? DB_SYNC : true
});