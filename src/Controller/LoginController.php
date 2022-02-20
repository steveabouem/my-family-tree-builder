<?php

namespace App\Controller;

use App\Entity\User;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class LoginController extends AbstractController
{
        /**
        * @Route("/login", name="login")
        */
        public function index(AuthenticationUtils $authenticationUtils): Response
        {
            // get the login error if there is one
            $error = $authenticationUtils->getLastAuthenticationError();

            // last username entered by the user
            $lastUsername = $authenticationUtils->getLastUsername();

              return $this->render('login/index.html.twig', [
                'last_username' => $lastUsername,
                'error'         => $error,
              ]);
        }

        /**
        * @Route("api/login", name="submit_login")
        */
//         public function submitLoginForm(UserPasswordHasherInterface $passwordHasher, Request $request)
//         {
//             $em = $this->getDoctrine()->getManager();
//             $reqData = json_decode($request->getContent());
//
//             $email = $reqData->email;
//             $plaintextPassword = $reqData->password;
//             $user = $em->getRepository(User::class)->findOneByEmail($email);
//
//             if (!$user) {
//                 return new JsonResponse(
//                     [
//                         'name' => $name,
//                         'email' => $email,
//                     ]
//                 );
//             }
//
//            return new JsonResponse(['status' => '400', 'msg' => 'Already exists']);
//
//         }
}