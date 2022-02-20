<?php
namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use App\Entity\User;
use DateTime;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\RedirectResponse;

class RegistrationController extends AbstractController
{
    /**r
    * @Route("/register", name="registration")
    */
    public function show()
    {
        return $this->render('registration/index.html.twig');
    }

    /**
    * @Route("api/register", name="submit_registration")
    */
    public function submitRegistrationForm(UserPasswordHasherInterface $passwordHasher, Request $request)
    {
        $em = $this->getDoctrine()->getManager();
        $reqData = json_decode($request->getContent());

        $email = $reqData->email;
        $name = $reqData->name;
        $plaintextPassword = $reqData->password;
        $user = $em->getRepository(User::class)->findOneByEmail($email);

        if (!$user) {
            $user = new User();

            $hashedPassword = $passwordHasher->hashPassword(
                $user,
                $plaintextPassword
            );
            $user->setEmail($email);
            $user->setName($name);
            $user->setPassword($hashedPassword);
            $user->setDateCreated(new \DateTime());
            $em->persist($user);
            $em->flush();

            return new JsonResponse(
                [
                    'name' => $name,
                    'email' => $email,
                ]
            );
        }

       return new JsonResponse(['status' => '400', 'msg' => 'Already exists']);

    }
}