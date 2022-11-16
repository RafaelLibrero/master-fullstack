<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Validator\Validation;
use Symfony\Component\Validator\Constraints\Email;

use App\Entity\User;
use App\Entity\Video;
use App\Services\JwtAuth;

class UserController extends AbstractController {

    private function resjson($data) {

        $json = $this->get('serializer')->serialize($data, 'json');

        $response = new Response();

        $response->setContent($json);
        $response->headers->set('Content-Type', 'application/json');

        return $response;
    }

    public function register(Request $request) {

        $json = $request->get('json', null);

        $params = json_decode($json);

        $data = [
            'status' => 'error',
            'code' => 400,
            'message' => 'El usuario no se ha creado.'
        ];

        if ($json != null) {

            $name = (!empty($params->name)) ? $params->name : null;
            $surname = (!empty($params->surname)) ? $params->surname : null;
            $email = (!empty($params->email)) ? $params->email : null;
            $password = (!empty($params->password)) ? $params->password : null;

            $validator = Validation::createValidator();
            $validate_email = $validator->validate($email, [
                new Email()
            ]);

            if (!empty($email) && count($validate_email) == 0 && !empty($password)
                    && !empty($name) && !empty($surname)) {

                $user = new User();
                $user->setName($name);
                $user->setSurname($surname);
                $user->setEmail($email);
                $user->setRole('ROLE_USER');
                $user->setCreatedAt(new \Datetime('now'));
                
                $pwd = hash('sha256', $password);
                $user->setPassword($pwd);
                
                $doctrine = $this->getDoctrine();
                $entityManager = $this->getDoctrine()->getManager();
                
                $user_repo = $doctrine->getRepository(User::class);
                $isset_user = $user_repo->findBy(array(
                   'email' => $email 
                ));
                
                if(count($isset_user) == 0) {
                    
                    $entityManager->persist($user);
                    $entityManager->flush();
                    
                    $data = [
                        'status' => 'success',
                        'code' => 200,
                        'message' => 'Usuario creado correctamente',
                        'user' => $user
                    ];
                    
                } else {
                    $data = [
                        'status' => 'error',
                        'code' => 400,
                        'message' => 'El usuario ya existe'
                    ];
                }
            }
        }

        return $this->resjson($data);
    }
    
    public function login(Request $request, JwtAuth $jwt_auth){
        
        $json = $request->get('json', null);
        
        $params = json_decode($json);
        
        $data = [
            'status' => 'error',
            'code' => 400,
            'message' => 'El usuario no se ha podido identificar'
        ];
        
        if($json != null){
            
            $email = (!empty($params->email)) ? $params->email : null;
            $password = (!empty($params->password)) ? $params->password : null;
            $gettoken = (!empty($params->gettoken)) ? $params->gettoken : null;
            
            $validator = Validation::createValidator();
            $validate_email = $validator->validate($email, [
                new Email()
            ]);
            
            if(!empty($email) && !empty($password) && count($validate_email) == 0){
                
                $pwd = hash('sha256', $password);
                
                if($gettoken){
                    $signup = $jwt_auth->signup($email, $pwd, $gettoken);
                } else {
                    $signup = $jwt_auth->signup($email, $pwd);
                }
                
                return new JsonResponse($signup);
                
            } else {
                
            }
        }
        
        return $this->resjson($data);
        
    }
    
    public function update(Request $request, JwtAuth $jwt_auth){
        
        $token = $request->headers->get('Authorization');
        
        $authCheck = $jwt_auth->checkToken($token);
        
        $data = [
            'status' => 'error',
            'code' => 400,
            'message' => 'Usuario no actualizado'
        ];
        
        if($authCheck){
            
            $entityManager = $this->getDoctrine()->getManager();
            
            $identity = $jwt_auth->checkToken($token, true);
            
            $user_repo = $this->getDoctrine()->getRepository(User::class);
            $user = $user_repo->findOneBy([
                'id' => $identity->sub
            ]);
            
            $json = $request->get('json', null);
            $params = json_decode($json);
            
            if(!empty($json)){
                $name = (!empty($params->name)) ? $params->name : null;
                $surname = (!empty($params->surname)) ? $params->surname : null;
                $email = (!empty($params->email)) ? $params->email : null;

                $validator = Validation::createValidator();
                $validate_email = $validator->validate($email, [
                    new Email()
                ]);

                if (!empty($email) && count($validate_email) == 0 
                        && !empty($name) && !empty($surname)) {
                    
                    $user->setName($name);
                    $user->setSurname($surname);
                    $user->setEmail($email);
                    
                    $isset_user = $user_repo->findBy([
                        'email' => $email
                    ]);
                    
                    if(count($isset_user) == 0 || $identity->email == $email){
                        
                        $entityManager->persist($user);
                        $entityManager->flush();
                        
                        $data = [
                            'status' => 'success',
                            'code' => 200,
                            'message' => 'Usuario actualizado',
                            'user' => $user
                        ];
                    } else {
                        $data = [
                            'status' => 'error',
                            'code' => 400,
                            'message' => 'No puedes usar ese email',
                        ];
                    }
                }
            }
        }
        
        return $this->resjson($data);
    }

}
