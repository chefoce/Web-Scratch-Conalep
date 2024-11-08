// src/pages/ProjectDetail.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import projects from "../data/projects";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  orderBy,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
  limit,
  startAfter,
} from "firebase/firestore";
import { FaHeart } from "react-icons/fa";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

// Importamos las funciones de cookies
import { setCookie, getCookie } from "../utils/cookies";

function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [canLike, setCanLike] = useState(true);
  const [likesCount, setLikesCount] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMoreComments, setHasMoreComments] = useState(true);

  const getUserId = () => {
    let userId = getCookie("userId");
    if (!userId) {
      userId = `anon_${Date.now()}_${Math.random()}`;
      setCookie("userId", userId, 365); // La cookie expirará en 365 días
    }
    return userId;
  };

  useEffect(() => {
    // Obtener el proyecto de la lista
    const selectedProject = projects.find((proj) => proj.id === id);
    setProject(selectedProject);
  }, [id]);

  useEffect(() => {
    // Reiniciar estados al cambiar de proyecto
    setComments([]);
    setLastVisible(null);
    setHasMoreComments(true);
    fetchComments(true);
    checkLikeAvailability();
    fetchLikes();
  }, [id]);

  const fetchComments = async (reset = false) => {
    let q;

    if (reset || !lastVisible) {
      q = query(
        collection(db, "comments"),
        where("projectId", "==", id),
        where("hidden", "==", false),
        orderBy("timestamp", "desc"),
        limit(5)
      );
    } else {
      q = query(
        collection(db, "comments"),
        where("projectId", "==", id),
        where("hidden", "==", false),
        orderBy("timestamp", "desc"),
        startAfter(lastVisible),
        limit(5)
      );
    }

    const querySnapshot = await getDocs(q);
    const commentsData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    if (reset) {
      setComments(commentsData);
    } else {
      setComments((prevComments) => [...prevComments, ...commentsData]);
    }

    if (querySnapshot.docs.length < 5) {
      setHasMoreComments(false);
    }

    if (querySnapshot.docs.length > 0) {
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
    }
  };

  const addComment = async () => {
    if (commentText.trim() === "") return;
    await addDoc(collection(db, "comments"), {
      projectId: id,
      text: commentText,
      timestamp: serverTimestamp(),
      reports: 0,
      hidden: false,
    });
    setCommentText("");
    // Reiniciar estados y volver a cargar los comentarios
    setComments([]);
    setLastVisible(null);
    setHasMoreComments(true);
    fetchComments(true);
  };

  const fetchLikes = async () => {
    const projectDocRef = doc(db, "projects", id);
    const projectDoc = await getDoc(projectDocRef);

    if (projectDoc.exists()) {
      setLikesCount(projectDoc.data().likes || 0);
    } else {
      // Si el documento no existe, crearlo con likes = 0
      await setDoc(projectDocRef, { likes: 0 });
      setLikesCount(0);
    }
  };

  const addLike = async () => {
    const likeDocRef = doc(db, "likes", `project_${id}_user_${getUserId()}`);
    const likeDoc = await getDoc(likeDocRef);

    if (likeDoc.exists()) {
      setCanLike(false);
      alert("Ya has dado like a este proyecto.");
      return;
    }

    await setDoc(likeDocRef, {
      timestamp: serverTimestamp(),
    });

    const projectDocRef = doc(db, "projects", id);
    await updateDoc(projectDocRef, {
      likes: increment(1),
    });

    setCanLike(false);
    setLikesCount((prevCount) => prevCount + 1); // Actualizar el conteo localmente
    setShowConfetti(true);
    // Ocultar confeti después de 5 segundos
    setTimeout(() => {
      setShowConfetti(false);
    }, 5000);
  };

  const checkLikeAvailability = async () => {
    const likeDocRef = doc(db, "likes", `project_${id}_user_${getUserId()}`);
    const likeDoc = await getDoc(likeDocRef);

    if (likeDoc.exists()) {
      setCanLike(false);
    } else {
      setCanLike(true);
    }
  };

  const handleReportComment = async (commentId) => {
    const commentDocRef = doc(db, "comments", commentId);
    await updateDoc(commentDocRef, {
      reports: increment(1),
    });

    const commentDoc = await getDoc(commentDocRef);
    if (commentDoc.data().reports >= 3) {
      // Ocultar el comentario
      await updateDoc(commentDocRef, {
        hidden: true,
      });
    }

    fetchComments();
  };

  if (!project) return <div>Cargando...</div>;

  return (
    <div className="flex justify-center min-h-screen mt-10 text-white">
      <div className="w-full max-w-xl">
        <h1 className="text-3xl font-bold text-center mb-5">{project.title}</h1>
        <p className="text-justify mt-2">
          <strong>Autor: </strong> {project.author}
        </p>
        <p className="text-justify mt-2">
          <strong>Descripción: </strong> {project.description}
        </p>
        <p className="text-justify mt-2">
          <strong>Instrucciones: </strong> {project.instructions}
        </p>
        <div className="my-4 mx-10">
          <iframe
            src={`https://turbowarp.org/${id}/embed`}
            width="485"
            height="402"
            frameBorder="0"
            scrolling="no"
            allowFullScreen
            title={project.title}
          ></iframe>
        </div>
        <div>
          {showConfetti && <Confetti width={width} height={height} />}
          <button
            onClick={addLike}
            className={`flex items-center px-4 py-2 rounded mb-5 mx-auto ${
              canLike
                ? "rgb-button text-white font-bold py-3 px-20 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-110"
                : "rgb-button-disabled bg-slate-500 text-white font-bold py-3 px-20 rounded-full shadow-lg cursor-not-allowed"
            }`}
            disabled={!canLike}
          >
            <FaHeart className="mr-3 w-6 h-6" />
            {canLike ? "Like" : "Ya has dado like"}
          </button>
          <span className="text-2xl">Likes: {likesCount}</span>
        </div>
        <h2 className="text-2xl font-bold mt-8">Comentarios</h2>
        <div className="my-4">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="w-full p-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
            placeholder="Escribe un comentario..."
          ></textarea>
          <button
            onClick={addComment}
            className="bg-green-500 text-white px-4 py-2 rounded mt-2"
          >
            Enviar Comentario
          </button>
        </div>
        <div>
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-gray-100 dark:bg-gray-800 p-2 rounded my-2"
            >
              <p className="text-gray-800 dark:text-white">{comment.text}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {new Date(comment.timestamp?.toDate()).toLocaleString()}
              </p>
              <button
                onClick={() => handleReportComment(comment.id)}
                className="text-red-500 text-sm mt-1"
              >
                Reportar
              </button>
            </div>
          ))}

          {hasMoreComments && (
            <button
              onClick={() => fetchComments()}
              className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
            >
              Cargar más comentarios
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectDetail;
