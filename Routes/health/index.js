const routes=require('express').Router();
const HealthCheckController=require('../../Controller/HealthCheck').HealthCheck;
routes.get('/health-check',HealthCheckController);
module.exports=routes;