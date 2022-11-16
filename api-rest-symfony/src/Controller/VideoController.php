<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Validator\Validation;
use Symfony\Component\Validator\Constraints\Email;
use Knp\Component\Pager\PaginatorInterface;
use App\Entity\User;
use App\Entity\Video;
use App\Services\JwtAuth;

class VideoController extends AbstractController {

    private function resjson($data) {

        $json = $this->get('serializer')->serialize($data, 'json');

        $response = new Response();

        $response->setContent($json);
        $response->headers->set('Content-Type', 'application/json');

        return $response;
    }

    public function create(Request $request, JwtAuth $jwt_auth, $id = null) {

        $token = $request->headers->get('Authorization', null);

        $authCheck = $jwt_auth->checkToken($token);

        if ($authCheck) {

            $json = $request->get('json', null);
            $params = json_decode($json);

            $identity = $jwt_auth->checkToken($token, true);

            if (!empty($json)) {

                $user_id = ($identity->sub != null) ? $identity->sub : null;
                $title = (!empty($params->title)) ? $params->title : null;
                $description = (!empty($params->description)) ? $params->description : null;
                $url = (!empty($params->url)) ? $params->url : null;

                if (!empty($user_id) && !empty($title)) {

                    $entityManager = $this->getDoctrine()->getManager();
                    $user = $this->getDoctrine()->getRepository(User::class)->findOneBy([
                        'id' => $user_id
                    ]);
                    
                    if ($id == null) {
                        
                        $video = new Video();
                        $video->setUser($user);
                        $video->setTitle($title);
                        $video->setDescription($description);
                        $video->setUrl($url);
                        $video->setStatus('normal');

                        $createdAt = new \DateTime('now');
                        $updatedAt = new \DateTime('now');
                        $video->setCreatedAt($createdAt);
                        $video->setUpdatedAt($updatedAt);

                        $entityManager->persist($video);
                        $entityManager->flush();

                        $data = [
                            'status' => 'success',
                            'code' => 200,
                            'message' => 'El video se ha guardado',
                            'video' => $video
                        ];
                    } else {
                        
                        $video = $this->getDoctrine()->getRepository(Video::class)->findOneBy([
                            'id' => $id,
                            'user' => $identity->sub
                        ]);
                        
                        if ($video && is_object($video)) {
                            $video->setTitle($title);
                            $video->setDescription($description);
                            $video->setUrl($url);

                            $updatedAt = new \DateTime('now');
                            $video->setUpdatedAt($updatedAt);
                            
                            $entityManager->persist($video);
                            $entityManager->flush();
                            
                            $data = [
                                'status' => 'success',
                                'code' => 200,
                                'message' => 'El video se ha actualizado',
                                'video' => $video
                            ];
                        } else {
                            $data = [
                                'status' => 'error',
                                'code' => 400,
                                'message' => 'No se ha podido actualizar el video'
                            ];
                        }
                    }

                    
                }
            }
        }

        return $this->resjson($data);
    }

    public function videos(Request $request, JwtAuth $jwt_auth, PaginatorInterface $paginator) {

        $token = $request->headers->get('Authorization');

        $authCheck = $jwt_auth->checkToken($token);

        if ($authCheck) {

            $identity = $jwt_auth->checkToken($token, true);

            $entityManager = $this->getDoctrine()->getManager();

            $dql = "SELECT v FROM App\Entity\Video v WHERE v.user = {$identity->sub} ORDER BY v.id DESC";
            $query = $entityManager->createQuery($dql);

            $page = $request->query->getInt('page', 1);
            $items_per_page = 5;

            $pagination = $paginator->paginate($query, $page, $items_per_page);
            $total = $pagination->getTotalItemCount();

            $data = array(
                'status' => 'success',
                'code' => 200,
                'total_items_count' => $total,
                'page_actual' => $page,
                'items_per_image' => $items_per_page,
                'total_pages' => ceil($total / $items_per_page),
                'videos' => $pagination,
                'user_id' => $identity->sub
            );
        } else {
            $data = array(
                'status' => 'error',
                'code' => 404,
                'message' => 'No se pueden listar los videos en este momento'
            );
        }


        return $this->resjson($data);
    }

    public function video(Request $request, JwtAuth $jwt_auth, $id = null) {

        $token = $request->headers->get('Authorization');
        
        $authCheck = $jwt_auth->checkToken($token);

        $data = [
                'status' => 'error',
                'code' => 404,
                'message' => 'Video no encontrado'
            ];
        
        if ($authCheck) {
            
            $identity = $jwt_auth->checkToken($token, true);
            
            $video = $this->getDoctrine()->getRepository(Video::class)->findOneBy([
                'id' => $id
            ]);
            
            if($video && is_object($video) && $identity->sub == $video->getUser()->getId()){
                $data = [
                    'status' => 'success',
                    'code' => 200,
                    'video' => $video
                ];
            }
        }

        return $this->resjson($data);
    }
    
    public function remove(Request $request, JwtAuth $jwt_auth, $id = null){
        
        $token = $request->headers->get('Authorization');
        $authCheck = $jwt_auth->checkToken($token);
        
        $data = [
                'status' => 'error',
                'code' => 404,
                'message' => 'Video no encontrado'
            ];
        
        if($authCheck){
            $identity = $jwt_auth->checkToken($token, true);
            
            $doctrine = $this->getDoctrine();
            $entityManager = $doctrine->getManager();
            $video = $doctrine->getRepository(Video::class)->findOneBy([
                'id' => $id
            ]);
            
            if($video && is_object($video) && $identity->sub == $video->getUser()->getId()){
                
                $entityManager->remove($video);
                $entityManager->flush();
                
                $data = [
                    'status' => 'success',
                    'code' => 200,
                    'video' => $video
                ];
            }
            
            
        }
        
        return $this->resjson($data);
    }

}
