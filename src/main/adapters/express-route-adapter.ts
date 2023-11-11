import { type HttpRequest, type HttpResponse, type IController } from '../../presentation/protocols'
import { type Request, type Response } from 'express'

export const adaptRoute = (controller: IController) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body
    }
    const httpResponse: HttpResponse = await controller.handle(httpRequest)
    if (httpResponse.statusCode === 200) return res.status(httpResponse.statusCode).json(httpResponse.body)
    res.status(httpResponse.statusCode).json({
      error: httpResponse.body.message
    })
  }
}
