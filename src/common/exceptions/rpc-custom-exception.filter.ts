import { ArgumentsHost, Catch, ExceptionFilter, RpcExceptionFilter } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { Observable, throwError } from "rxjs";

@Catch( RpcException )
// export class RpcCustomExceptionFilter implements RpcExceptionFilter<RpcException> {
export class RpcCustomExceptionFilter implements ExceptionFilter {
    catch(exception: RpcException, host: ArgumentsHost ) {
    // catch(exception: RpcException, host: ArgumentsHost ): Observable<any> {
        // console.log('Paso por aqui en nuestro Custom Fileter!')
        // return throwError ( () => exception.getError() );

        const ctx = host.switchToHttp();
        const response = ctx.getResponse();

        const rpcError = exception.getError();

        if( rpcError.toString().includes('Empty response') ){
            return response.status(500).json({
                status: 500,
                message: rpcError.toString().substring(0, rpcError.toString().indexOf('(') -1),
            })
        }

        if( 
            typeof rpcError == 'object' && 
            'status' in rpcError && 
            'message' in rpcError 
            // Se pueden hacer más validaciones como si el estatus es un número
        ){
            const status = isNaN(+rpcError.status) ? 400: rpcError.status;
            return response.status(status).json(rpcError);
        }

        response.status(400).json({
            status: 400,
            message: rpcError,
        });
    }
}